// pattern.js - Encapsulates pattern logic as pure functions.
//
// The original video shows a tall grid of numbers (1..N) with green top/bottom rows
// and two colored diagonals (red and blue) that form a snaking 'S' pattern.
//
// This file exposes generatePattern(rows, cols, phase) which deterministically
// returns a 2D array of { number, color } matching the visual from the video as a
// best-effort algorithmic approximation.
//
// Rules implemented:
// - Top and bottom rows are green.
// - Two diagonal 'ribbons' are drawn using arithmetic on the 1-based index:
//     * primary diagonal positions where (index - 1) % (cols + 1) == 0  -> red ribbon
//     * secondary diagonal positions where (index - 1) % (cols - 1) == 0 -> blue ribbon
// - Each ribbon is thickened by including offsets (-1, 0, +1) on the row index to match clusters.
// - phase parameter shifts the ribbon positions (used by animation) so Start toggles motion.
// - Cells that match both ribbons prefer red (to match overlapping appearance in the video).
// - Always keep top/bottom rows green (they override ribbons).
//
// This is intentionally pure and side-effect free so you can test it separately.
export function generatePattern(rows, cols, phase = 0) {
  // sanitize
  rows = Math.max(5, Math.floor(rows));
  cols = Math.max(5, Math.floor(cols));

  const total = rows * cols;
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const index = r * cols + c + 1; // 1-based numbering, left->right, top->bottom
      let color = 'black';

      // Top & Bottom rows are green
      if (r === 0 || r === rows - 1) {
        color = 'green';
        row.push({ number: index, color });
        continue;
      }

      // Compute membership in ribbons using modular arithmetic with phase shift
      const primaryMod = (cols + 1);
      const secondaryMod = (cols - 1) || 1;

      const inPrimary = ((index - 1 + phase) % primaryMod) === 0;
      const inSecondary = ((index - 1 + Math.floor(phase/2)) % secondaryMod) === 0;

      // To create thicker diagonal appearance, check neighbor indices (index +/- 1, +/- cols)
      const neighbours = [
        index, index - 1, index + 1,
        index - cols, index + cols
      ];

      const primaryThick = neighbours.some(i => ((i - 1 + phase) % primaryMod) === 0);
      const secondaryThick = neighbours.some(i => ((i - 1 + Math.floor(phase/2)) % secondaryMod) === 0);

      // Decide colors: red priority when overlap
      if (primaryThick) color = 'red';
      if (secondaryThick && !primaryThick) color = 'blue';

      // Small tweak: add occasional blue 'blips' for variety similar to the video
      if (color === 'black') {
        // deterministic pattern - not random: use modulo to place blues
        if ((index + Math.floor(index / cols)) % 13 === 0) color = 'blue';
      }

      row.push({ number: index, color });
    }
    grid.push(row);
  }
  return grid;
}
