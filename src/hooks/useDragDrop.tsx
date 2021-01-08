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


  const handleDrag = useCallback((event: TouchEvent | MouseEvent) => {
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

  const handleMouseDown = useCallback((event: MouseEvent | TouchEvent) => {
    handleCheckTouch(event)

    setIsDragging(true)
    event.preventDefault()
    onDragStart(event)
  }, [onDragStart])

  const handleMouseUp = useCallback((event: MouseEvent | TouchEvent) => {
    setIsTouching(false)
    setIsDragging(false)

    event.preventDefault()
    onDragEnd(event)
    onDrop(event)
  }, [onDrop, onDragEnd])

  const handleMouseMove = useCallback((event: MouseEvent | TouchEvent) => {
    if (isDragging) {
      event.preventDefault()
      event.stopPropagation()

      handleDrag(event)
      onDrag(event)
    }
  }, [handleDrag, isDragging, onDrag])


  useEffect(() => {
    const element = draggableRef.current
    if (element) {
      element.addEventListener("mousedown", handleMouseDown)
      element.addEventListener("mouseup", handleMouseUp)
      element.addEventListener("mousemove", handleMouseMove)
      // Touch events
      element.addEventListener("touchmove", handleMouseMove, { passive: false })
      element.addEventListener("touchend", handleMouseUp)
      element.addEventListener("touchstart", handleMouseDown)

      return () => {
        element.removeEventListener("mousedown", handleMouseDown)
        element.removeEventListener("mouseup", handleMouseUp)
        element.removeEventListener("mousemove", handleMouseMove)
        // Drag events
        element.removeEventListener("touchmove", handleMouseMove)
        element.removeEventListener("touchend", handleMouseUp)
        element.removeEventListener("touchstart", handleMouseDown)
      }
    }

    return () => { }
  }, [handleMouseDown, handleMouseMove, handleMouseUp, isDragging, draggableRef])

  return {
    isDragging,
    isTouching,
    isDraggableOverllapping,
    translate,
    setTranslate,
  }
}

export default useDragDrop
