import { RefObject, useEffect, useState } from "react";

export function useElementResize(ref: RefObject<Element>) {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return size;

  function updateSize() {
    setSize({
      width: ref.current?.clientWidth ?? 0,
      height: ref.current?.clientHeight ?? 0,
    });
  }
}
