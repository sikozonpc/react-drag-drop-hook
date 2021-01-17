
const calculateElementsOverlap = (el1: DOMRect, el2: DOMRect) => {
  return !(
    el1.right < el1.left ||
    el1.left > el2.right ||
    el1.bottom < el2.top ||
    el1.top > el2.bottom
  )
}

export default calculateElementsOverlap