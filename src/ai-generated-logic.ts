/**
 * Calculates the area of a circle given its radius.
 * @param radius The radius of the circle.
 * @returns The area of the circle.
 */
export function calculateCircleArea(radius: number): number {
  if (radius < 0) {
    throw new Error("Radius cannot be negative.");
  }
  return Math.PI * radius * radius;
}