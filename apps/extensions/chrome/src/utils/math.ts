import { Point } from "../types/geometry";

export function degToRad(degrees: number) {
  return (Math.PI * degrees) / 180;
}

export function radToDeg(radian: number) {
  return radian * (180 / Math.PI);
}

/**
 * Calculates angle from the origin to the end point in radians.
 * @param origin
 * @param end
 */
export function calcAngle(origin: Point, end: Point) {
  const hypotenuse = dist(end, origin);
  const radFromOrigin = Math.asin((end.y - origin.y) / hypotenuse);

  //0 is included in positive
  const xPos = end.x - origin.x >= 0;
  const yPos = end.y - origin.y >= 0;

  //If line angle is in 2nd or third quadrant
  if (!xPos) {
    return Math.PI - radFromOrigin;
  }
  //If line angle is in 4th quadrant
  if (xPos && !yPos) {
    return 2 * Math.PI + radFromOrigin;
  }

  return radFromOrigin;
}

export function dist(point1: Point, point2: Point) {
  return Math.sqrt(
    Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2)
  );
}

export function roundRange(numb: number, range: number[]) {
  if (range.length != 2)
    throw new Error("Range needs to be array of 2 values [min, max]");
  if (range[1]! < range[0]!)
    throw new Error(
      `Max (${range[1]}) can't be smaller than min (${range[0]})`
    );

  return Math.min(range[1]!, Math.max(range[0]!, numb));
}
