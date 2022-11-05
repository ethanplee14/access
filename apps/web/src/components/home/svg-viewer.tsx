import React, { ReactNode, useRef } from "react";
import { Point } from "../../types/geometry";

export type SVGViewerProps = {
  scalar?: number;
  onScalarChange?: (scalar: number) => void;
  translate?: Point;
  onTranslateChange?: (translate: Point) => void;
  children?: ReactNode;
  onMouseMove?: React.MouseEventHandler;
};

export default function SVGViewer(props: SVGViewerProps) {
  const scaleMultiplier = 0.05;
  const scalar = props.scalar ?? 1;
  const translate = props.translate ?? { x: 0, y: 0 };
  const dragging = useRef(false);

  return (
    <svg
      width={"100%"}
      height={"100%"}
      onWheel={wheelZoom}
      onMouseDown={(_) => (dragging.current = true)}
      onMouseMove={handleMouseMove}
      onMouseUp={(_) => (dragging.current = false)}
      onMouseLeave={(_) => (dragging.current = false)}
    >
      <g
        transform={`scale(${scalar}) translate(${translate.x} ${translate.y})`}
      >
        {props.children}
      </g>
    </svg>
  );

  function wheelZoom(e: React.WheelEvent<SVGSVGElement>) {
    const newScalar = Math.max(
      scalar + (e.deltaY > 0 ? -1 : 1) * scaleMultiplier
    );
    props.onScalarChange?.(newScalar);
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    props.onMouseMove?.(e);

    if (!e.defaultPrevented && dragging.current) {
      window.getSelection()?.removeAllRanges();
      props.onTranslateChange?.({
        x: translate.x + e.movementX / scalar,
        y: translate.y + e.movementY / scalar,
      });
    }
  }
}
