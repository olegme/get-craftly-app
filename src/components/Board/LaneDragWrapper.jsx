import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '../Card/ItemTypes';

export const LaneDragWrapper = ({ 
  column, 
  columnIndex, 
  children, 
  onMoveLane 
}) => {
  const ref = useRef(null);

  // Drag source for lane
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.LANE,
    item: { id: column.id, index: columnIndex },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Drop target for lane
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: ItemTypes.LANE,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
    hover: (draggedItem, monitor) => {
      if (!ref.current) {
        return;
      }

      const dragIndex = draggedItem.index;
      const hoverIndex = columnIndex;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleX = (hoverBoundingRect.right - hoverBoundingRect.left) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the left of the item
      const hoverClientX = clientOffset.x - hoverBoundingRect.left;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging right, only move when the cursor is below 50%
      // When dragging left, only move when the cursor is above 50%
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return;
      }
      // When dragging left, only move when the cursor is above 50%
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return;
      }

      // Time to actually perform the action
      onMoveLane(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      draggedItem.index = hoverIndex;
    },
  });

  const opacity = isDragging ? 0.4 : 1;
  drag(drop(ref));

  return (
    <div 
      ref={ref} 
      style={{ opacity }}
      className={isOver && !isDragging ? 'ring-2 ring-blue-500 rounded-lg' : ''}
    >
      {children}
    </div>
  );
};
