import { useRef, useState } from 'react'
import './App.css'
import useDragDrop from './hooks/useDragDrop'
import cx from 'classnames'
import Draggable from './components/Draggable'


function App() {
  const draggableRef = useRef<HTMLDivElement | null>(null)
  const droppableRef = useRef<HTMLDivElement | null>(null)
  const [initialPos] = useState({ x: 0, y: 0 })

  /** 
   * Resets the draggable to the initial position if the draggable
   * was not places inside the drop zone
  */
  const resetToInitalPosition = () => {
    if (!isDraggableOverllapping) {
      setTranslate(initialPos)
    }
  }

  const { translate, isDragging, isDraggableOverllapping, setTranslate } = useDragDrop(draggableRef, droppableRef, {
    onDrop: () => {
      resetToInitalPosition()
    },
  })

  return (
    <div className="App">
      <header className="App-header">
        <div
          ref={droppableRef}
          className="droppable"
          style={{
            borderColor: isDraggableOverllapping ? "red" : "transparent",
          }}
        >
          Droppable zone
        </div>

        <div
          ref={draggableRef}
          className={cx("draggable", {
            "active": isDragging,
          })}
          style={{ transform: `translateX(${translate.x}px) translateY(${translate.y}px)` }}
        >
          Draggable div
        </div>

        <Draggable
          droppableRef={droppableRef}
        >
          Draggable component abstraction
        </Draggable>
      </header>
    </div>
  )
}

export default App
