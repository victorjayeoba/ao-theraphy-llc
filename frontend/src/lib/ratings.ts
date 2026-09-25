// Ratings come from the API (`rating` / `review_count`), loaded from Amazon by
// backend/database/seeders/AmazonRatingsSeeder.php and editable in the admin dashboard.
// A product without a rating shows no stars.

export interface Rating {
  rating: number;
  reviewCount: number;
}

/** The product's rating, or null when it has none. Laravel may send decimals as strings. */
export const productRating = (p: {
  rating?: number | string | null;
  review_count?: number | string | null;
  reviewCount?: number | string | null;
}): Rating | null =>
  p.rating != null && p.rating !== ""
    ? { rating: Number(p.rating), reviewCount: Number(p.review_count ?? p.reviewCount ?? 0) }
    : null;
