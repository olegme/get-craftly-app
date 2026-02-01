import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../Card/ItemTypes';

export const DropZone = ({ children, columnId, rowIndex, moveCard }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item) => moveCard(item, columnId, rowIndex),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      data-testid="dropzone"
      data-lane-id={columnId}
      data-row-index={rowIndex}
      className={`flex-grow min-h-20 rounded-lg p-2 transition-colors ${
        isOver ? 'bg-blue-50 border-2 border-blue-200 border-dashed' : 'bg-gray-50'
      }`}
      style={{ flexBasis: '100%' }}
    >
      {children}
    </div>
  );
};
