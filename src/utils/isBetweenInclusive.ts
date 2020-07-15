export const isBetweenInclusive =
  (lowerBound:number, upperBound:number) =>
  (num:number) =>
  num >= lowerBound && num <= upperBound
