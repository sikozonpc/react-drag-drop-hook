import React from 'react'
import useDragDrop, { UseDragDropOptions } from '../../hooks/useDragDrop'
import cx from 'classnames'

interface DraggableProps extends
  Omit<React.HTMLAttributes<HTMLDivElement>, 'onDrag' | 'onDragEnd' | 'onDragStart' | 'onDrop'>,
  UseDragDropOptions {
  droppableRef?: React.RefObject<HTMLDivElement>,
}


const Draggable: React.FC<DraggableProps> = ({
  droppableRef,
  onDrag,
  onDragEnd,
  onDragStart,
  onDrop,
  style,
  className,
  children,
  ...rest
}) => {
  const draggableRef = React.useRef<HTMLDivElement | null>(null)
  const { translate, isDragging } = useDragDrop(draggableRef, droppableRef, {
    onDrag,
    onDragEnd,
    onDragStart,
    onDrop,
  })

  // NOTE: To consume the `useDragDrop` values we must create a React Context and wrap every `<Draggable />` and pass that state there
  // and then create and consume a useDragDropContext() hook, to access those properties.

  return (
    <div
      ref={draggableRef}
      className={cx("draggable", {
        "active": isDragging,
      })}
      style={{
        ...style,
        transform: `translateX(${translate.x}px) translateY(${translate.y}px)`,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Draggable