// Demo ratings. No backend column, no DB migration: the rating is derived from the
// product key, so it is stable across reloads and identical on every device.
// Swap `ratingFor` for a real API field when reviews actually exist.

// FNV-1a: tiny, deterministic, good enough spread for a display value.
const hash = (s: string): number => {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
};

export interface Rating {
  rating: number;
  reviewCount: number;
}

/** Stable pseudo-rating in the 4.5 - 5.0 range, plus a plausible review count. */
export const ratingFor = (key: string | number): Rating => {
  const h = hash(String(key));
  return {
    rating: Number((4.5 + (h % 6) / 10).toFixed(1)),
    reviewCount: 18 + ((h >>> 8) % 265),
  };
};
