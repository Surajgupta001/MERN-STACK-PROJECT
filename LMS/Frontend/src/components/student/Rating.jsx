import React, { useEffect, useState } from 'react'

function Rating({ initialrating, onRate }) {

  const [rating, setRating] = useState(initialrating || 0);

  const handleRating = (value) => {
    setRating(value);
    if (onRate) {
      onRate(value);
    }
  };

  useEffect(() => {
    if (initialrating) {
      setRating(initialrating);
    }
  }, [initialrating])

  return (
    <div>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        return (
          <span onClick={() => handleRating(starValue)} key={index} className={`text-xl ms:text-2xl cursor-pointer transition-colors ${starValue <= rating ? 'text-yellow-400' : 'text-gray-400'}`}>
            &#9733;
          </span>
        )
      })}
    </div>
  )
}

export default Rating
