export function delay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function createDeterministicRandom(seed = 1) {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

export function generateSparkline(count = 12, seed = 1): number[] {
  const random = createDeterministicRandom(seed);
  const values: number[] = [];
  let base = random() * 40 + 30;
  for (let i = 0; i < count; i++) {
    const change = random() * 8 - 4;
    base = Math.max(5, base + change);
    values.push(parseFloat(base.toFixed(2)));
  }
  return values;
}
