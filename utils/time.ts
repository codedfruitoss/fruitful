function getMinutes(s: number) {
  return Math.floor(s / 60);
}

export function getDisplayTime(seconds: number) {
  const minutes = getMinutes(seconds);
  const s = seconds % 60;
  return `${minutes}:${s < 10 ? '0' + s : s}`;
}
