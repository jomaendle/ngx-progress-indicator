export function getCircumference(r: number) {
  return 2 * Math.PI * r;
}

export function getDashOffset(r: number, progress: number) {
  return getCircumference(r) - (progress / 100) * getCircumference(r);
}

export function getClampedValue(value: number) {
  return Math.min(100, Math.max(0, value));
}
