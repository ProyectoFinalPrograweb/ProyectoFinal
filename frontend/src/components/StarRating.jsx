import React from 'react';
import './StarRating.css';

export default function StarRating({ rating = 0, max = 5, size = 'md', interactive = false, onChange }) {
  const filled = Math.round(rating);

  return (
    <div className={`star-rating star-rating--${size}`}>
      {Array.from({ length: max }).map((_, i) => (
        <button
          key={i}
          className={`star ${i < filled ? 'filled' : ''} ${interactive ? 'interactive' : ''}`}
          onClick={interactive ? () => onChange?.(i + 1) : undefined}
          disabled={!interactive}
          aria-label={`${i + 1} estrella${i + 1 !== 1 ? 's' : ''}`}
        >
          {i < filled ? '★' : '☆'}
        </button>
      ))}
      <span className="star-value">{rating.toFixed(1)}</span>
    </div>
  );
}
