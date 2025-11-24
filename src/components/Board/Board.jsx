import React from 'react';
import { Lane } from './Lane';
import { LaneDragWrapper } from './LaneDragWrapper';

export const Board = ({
  columns,
  getColumnColor,
  updateColumnTitle,
  addLane,
  deleteLane,
  moveCard,
  moveLane,
  updateCardTitle,
  updateCardTags,
  availableTags,
  addNewTag,
  toggleCardPriority,
  toggleCardCompleted,
  updateCardDate,
  addCard,
}) => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-6 w-full items-start">
      {columns.map((column, idx) => (
        <LaneDragWrapper
          key={column.id}
          column={column}
          columnIndex={idx}
          onMoveLane={moveLane}
        >
          <Lane
            column={column}
            columnIndex={idx}
            getColumnColor={getColumnColor}
            updateColumnTitle={updateColumnTitle}
            addLane={addLane}
            deleteLane={deleteLane}
            moveCard={moveCard}
            updateCardTitle={updateCardTitle}
            updateCardTags={updateCardTags}
            availableTags={availableTags}
            addNewTag={addNewTag}
            toggleCardPriority={toggleCardPriority}
            toggleCardCompleted={toggleCardCompleted}
            updateCardDate={updateCardDate}
            addCard={addCard}
          />
        </LaneDragWrapper>
      ))}
    </div>
  );
};
