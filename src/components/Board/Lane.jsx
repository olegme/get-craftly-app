import React from 'react';
import { ColumnHeader } from './ColumnHeader';
import { DropZone } from './DropZone';
import { DraggableCard } from '../Card/DraggableCard';
import { AddCardForm } from '../Card/AddCardForm';

export const Lane = ({
  column,
  columnIndex,
  getColumnColor,
  updateColumnTitle,
  addLane,
  deleteLane,
  moveCard,
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
    <div key={column.id} className="flex-shrink-0 w-80">
      <div className={`${getColumnColor(column, columnIndex)} rounded-lg p-4`}>
        <ColumnHeader
          title={column.title}
          updateColumnTitle={(newTitle) => updateColumnTitle(column.id, newTitle)}
          addLane={() => addLane(column.id)}
          deleteLane={() => deleteLane(column.id)}
        />
        {(column.rows || []).map((row, rowIndex) => (
          <div key={rowIndex} className="mb-6 bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                {row.title}
              </span>
            </div>
            <DropZone columnId={column.id} rowIndex={rowIndex} moveCard={moveCard}>
              {row.cards.map((card) => (
                <DraggableCard
                  key={card.id}
                  card={card}
                  columnId={column.id}
                  rowIndex={rowIndex}
                  updateCardTitle={updateCardTitle}
                  updateCardTags={updateCardTags}
                  availableTags={availableTags}
                  addNewTag={addNewTag}
                  toggleCardPriority={toggleCardPriority}
                  toggleCardCompleted={toggleCardCompleted}
                  updateCardDate={updateCardDate}
                />
              ))}
              <AddCardForm columnId={column.id} rowIndex={rowIndex} addCard={addCard} />
            </DropZone>
          </div>
        ))}
      </div>
    </div>
  );
};
