import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  size?: number;
  className?: string;
}

/**
 * Five stars with a clipped gold overlay, so 4.7 actually renders as 4.7
 * rather than being rounded down to 4.
 */
const StarRating = ({ rating, reviewCount, size = 14, className = "" }: StarRatingProps) => {
  const clamped = Math.max(0, Math.min(5, rating));

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className="relative inline-flex shrink-0"
        role="img"
        aria-label={`Rated ${clamped} out of 5`}
      >
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={size} className="text-gray-300" aria-hidden="true" />
          ))}
        </div>
        <div
          className="absolute inset-0 flex overflow-hidden"
          style={{ width: `${(clamped / 5) * 100}%` }}
          aria-hidden="true"
        >
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={size}
              className="text-yellow-400 fill-current shrink-0"
            />
          ))}
        </div>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {clamped.toFixed(1)}
        {reviewCount !== undefined && ` (${reviewCount.toLocaleString()} on Amazon)`}
      </span>
    </div>
  );
};

export default StarRating;
