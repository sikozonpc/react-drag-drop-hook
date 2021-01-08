import { useState, useEffect, useCallback } from "react"
import { isMouseEvent, isTouchEvent } from "../event"
import calculateElementsOverlap from "../util/calculateElementsOverlap"

export interface UseDragDropOptions {
  onDragStart?: (event: MouseEvent | TouchEvent) => void
  onDragEnd?: (event: MouseEvent | TouchEvent) => void
  onDrag?: (event: MouseEvent | TouchEvent) => void
  onDrop?: (event: MouseEvent | TouchEvent) => void
}


const useDragDrop = (
  draggableRef: React.RefObject<HTMLElement>,
  droppableRef: React.RefObject<HTMLElement> | null | undefined = null,
  options: UseDragDropOptions
) => {
  const {
    onDragStart = () => { },
    onDragEnd = () => { },
    onDrag = () => { },
    onDrop = () => { },
  } = options

  const [isDragging, setIsDragging] = useState(false)
  const [isTouching, setIsTouching] = useState(false)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const [isDraggableOverllapping, setOverlap] = useState(false)


  const handleTranslateElement = useCallback((event: TouchEvent | MouseEvent) => {
    if (!draggableRef.current) {
      console.warn("Could not find an element draggable ref")
      return
    }

    const droppable = draggableRef.current.getBoundingClientRect()
    const dropZone = droppableRef?.current?.getBoundingClientRect()

    if (isMouseEvent(event)) {
      setTranslate({
        x: translate.x + event.movementX,
        y: translate.y + event.movementY
      })
    } else {
      if (event.touches.length === 0) return

      const touch = event.targetTouches[0]
      const relativeX = touch.pageX - droppable.left
      const relativeY = touch.pageY - droppable.top
      const draggableCenterPos = {
        x: (translate.x + relativeX) - droppable.width / 2,
        y: (translate.y + relativeY) - droppable.height / 2,
      }

      setTranslate(draggableCenterPos)
    }

    if (!dropZone) return

    setOverlap(calculateElementsOverlap(droppable, dropZone))
  }, [draggableRef, droppableRef, translate.x, translate.y])

  const handleCheckTouch = (event: MouseEvent | TouchEvent) => {
    return setIsTouching(isTouchEvent(event))
  }

  const handleDragStart = useCallback((event: MouseEvent | TouchEvent) => {
    handleCheckTouch(event)

    setIsDragging(true)
    event.preventDefault()
    onDragStart(event)
  }, [onDragStart])

  const handleDrop = useCallback((event: MouseEvent | TouchEvent) => {
    setIsTouching(false)
    setIsDragging(false)

    event.preventDefault()
    onDragEnd(event)
    onDrop(event)
  }, [onDrop, onDragEnd])

  const handleDragMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (isDragging) {
      event.preventDefault()
      event.stopPropagation()

      handleTranslateElement(event)
      onDrag(event)
    }

  }, [handleTranslateElement, isDragging, onDrag])


  useEffect(() => {
    const element = draggableRef.current
    if (element) {
      element.addEventListener("mousedown", handleDragStart)
      element.addEventListener("mouseup", handleDrop)
      element.addEventListener("mousemove", handleDragMove)
      // Touch events
      element.addEventListener("touchmove", handleDragMove, { passive: false })
      element.addEventListener("touchend", handleDrop)
      element.addEventListener("touchstart", handleDragStart)

      return () => {
        element.removeEventListener("mousedown", handleDragStart)
        element.removeEventListener("mouseup", handleDrop)
        element.removeEventListener("mousemove", handleDragMove)
        // Drag events
        element.removeEventListener("touchmove", handleDragMove)
        element.removeEventListener("touchend", handleDrop)
        element.removeEventListener("touchstart", handleDragStart)
      }
    }

    return () => { }
  }, [handleDragStart, handleDragMove, handleDrop, isDragging, draggableRef])

  return {
    isDragging,
    isTouching,
    isDraggableOverllapping,
    translate,
    setTranslate,
  }
}

export default useDragDrop
