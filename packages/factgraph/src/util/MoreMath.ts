export function lesserOf<T>(
  items: T[],
  valueExtractor: (item: T) => number,
): T | undefined {
  if (items.length === 0) {
    return undefined;
  }

  return items.reduce((prev, curr) => {
    return valueExtractor(prev) < valueExtractor(curr) ? prev : curr;
  });
}

export function greaterOf<T>(
  items: T[],
  valueExtractor: (item: T) => number,
): T | undefined {
  if (items.length === 0) {
    return undefined;
  }

  return items.reduce((prev, curr) => {
    return valueExtractor(prev) > valueExtractor(curr) ? prev : curr;
  });
}
