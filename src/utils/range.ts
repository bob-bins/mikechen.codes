import { Integer } from "./Integer";

export const range = (startInclusive:Integer, endInclusive:Integer) =>
  Array(endInclusive - startInclusive + 1)
    .fill(0)
    .map((_, index) => startInclusive + index)
