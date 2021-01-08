
const calculateElementsOverlap = (el1: DOMRect, el2: DOMRect) => {

  return !(
    el1.right < el1.left ||
    el1.left > el2.right ||
    el1.bottom < el2.top ||
    el1.top > el2.bottom
  )
}

export default calculateElementsOverlap

/**
 * Returns the intersecting rectangle area between two rectangles
 */
export function getIntersectionRatio(entry: DOMRect, target: DOMRect): number {
  const top = target.top
  const left = target.left
  const right = target.left + target.width
  const bottom = target.top + target.height
  const width = right - left;
  const height = bottom - top;

  if (left < right && top < bottom) {
    const targetArea = target.width * target.height;
    const entryArea = entry.width * entry.height;
    const intersectionArea = width * height;
    const intersectionRatio =
      intersectionArea / (targetArea + entryArea - intersectionArea);

    return Number(intersectionRatio.toFixed(4));
  }

  // Rectangles do not overlap, or overlap has an area of zero (edge/corner overlap)
  return 0;
}