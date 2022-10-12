
// If you want to random 0, 1, 2, min = 0, max = 3
export function randomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min) + min);
}
