import React, { useState } from 'react';
import { Star } from 'lucide-react';
import './StarRating.css';

export default function StarRating({ rating = 0, max = 5, size = 'md', interactive = false, onChange = null }) {
  const [hoverRating, setHoverRating] = useState(0);

  const filled = Math.round(hoverRating || rating);

  return (
    <div className={`star-rating size-${size} ${interactive ? 'interactive' : ''}`}>
      {[...Array(max)].map((_, i) => (
        <span
          key={i}
          className={`star ${i < filled ? 'filled' : ''}`}
          onMouseEnter={() => interactive && setHoverRating(i + 1)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          onClick={() => interactive && onChange && onChange(i + 1)}
          role={interactive ? "button" : "presentation"}
          tabIndex={interactive ? 0 : -1}
          style={{ display: 'inline-flex', alignItems: 'center' }}
        >
          <Star size={size === 'sm' ? 14 : size === 'lg' ? 24 : 18} fill={i < filled ? "currentColor" : "none"} color="currentColor" />
        </span>
      ))}
      <span className="star-value">{rating.toFixed(1)}</span>
    </div>
  );
}
