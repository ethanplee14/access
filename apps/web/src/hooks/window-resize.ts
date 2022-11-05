import { useEffect, useState } from "react";
import { Size } from "../types/geometry";

export function useWindowResize() {
  const [windowSize, setWindowSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, []);

  return windowSize;

  function updateWindowSize() {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }
}
