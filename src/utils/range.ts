export const range = (startInclusive: number, endInclusive: number) =>
  Array(endInclusive - startInclusive + 1)
    .fill(0)
    .map((_, index) => startInclusive + index)
