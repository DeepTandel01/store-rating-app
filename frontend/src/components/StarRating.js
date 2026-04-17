import React, { useState } from 'react';

const StarRating = ({ value = 0, onChange, readonly = false, size = 'md' }) => {
  const [hovered, setHovered] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  const display = hovered || value;

  return (
    <div className={`stars ${size === 'sm' ? 'stars-sm' : ''}`} style={{ display: 'inline-flex' }}>
      {stars.map(s => (
        <span
          key={s}
          className={`star ${s <= display ? 'filled' : ''}`}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
          onClick={() => !readonly && onChange && onChange(s)}
          onMouseEnter={() => !readonly && setHovered(s)}
          onMouseLeave={() => !readonly && setHovered(0)}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
