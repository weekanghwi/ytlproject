export function getFillColorBySINR(sinr: number): string {
  if (sinr >= 2) {
    return 'green';
  } else if (sinr >= 0) {
    return 'yellow';
  } else if (sinr >= -2) {
    return 'blue';
  } else {
    return 'red';
  }
}