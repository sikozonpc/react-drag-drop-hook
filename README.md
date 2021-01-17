

Very simple boilerplate code to show how to create a drag and drop with a exposing hook.

Features:
 - Touch support;
 - Mouse support;
 - Droppable zone;
 - No Packages external packages;
 - Calculates overlap between draggable and droppable
 

Example code under `App.tsx`


Consuming example:
```tsx
  const { translate, isDragging, isDraggableOverllapping, setTranslate } = useDragDrop(draggableRef, droppableRef, {
    onDrop: () => {
      resetToInitalPosition()
    },
  })
```

[Codesandbox example](https://codesandbox.io/s/usedrag-and-usedroppablezone-1mzjw)