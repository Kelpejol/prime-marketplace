"use client"
import { useEffect, useState } from "react";


const useWindowScroll = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const setPosition = () => {
      setScrollPosition(window.scrollY);
    }
    window.addEventListener("scroll", setPosition);
    setPosition();
    return () => window.removeEventListener("scroll", setPosition);
  }, []);

  return scrollPosition;
};

export default useWindowScroll;
