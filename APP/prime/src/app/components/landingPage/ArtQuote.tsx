"use client"
import React, { useCallback, useEffect, useState } from 'react';
import QuoteData from '../Quotes';

const ArtQuote = () => {
  const [current, setCurrent] = useState<number>(0);

  const handleNext = useCallback(() => {
    setCurrent(current => (current + 1) % QuoteData.length);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [handleNext]);

  return (
    <div className="max-w-[340px] mx-auto relative z-10 bg-white rounded-lg bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-20 border border-gray-200 shadow-lg p-6 flex flex-col transition-all duration-800 ease-in-out">
      <div className="text-white text-center text-lg font-semibold">
        {QuoteData.at(current)?.quote}
      </div>
      <div className="text-white text-center mt-2 font-medium">
        - {QuoteData.at(current)?.author} -
      </div>
    </div>
  );
};

export default ArtQuote;
