import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export default function StarRating({ rating, onRate, size = 'md', interactive = true }: StarRatingProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onRate?.(star)}
          className={cn(
            "transition-all duration-200",
            interactive ? "hover:scale-110 active:scale-95" : "cursor-default"
          )}
        >
          <Star
            className={cn(
              sizes[size],
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-zinc-300 fill-zinc-100"
            )}
          />
        </button>
      ))}
    </div>
  );
}
