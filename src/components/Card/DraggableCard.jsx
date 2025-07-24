import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { Tags } from './Tags';
import { CardTitle } from './CardTitle';
import { CardHeader } from './CardHeader';
import './DraggableCard.css';

export const DraggableCard = ({ card, columnId, rowIndex, updateCardTitle, updateCardTags, availableTags, addNewTag, toggleCardPriority, toggleCardCompleted, updateCardDate }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { ...card, sourceColumnId: columnId, sourceRowIndex: rowIndex },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const cardBg = card.color ? card.color : 'bg-white';

  return (
    <div
      ref={drag}
      className={`${cardBg} rounded-lg border border-gray-200 p-3 mb-3 cursor-move hover:shadow-md transition-shadow ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <CardHeader
        card={card}
        columnId={columnId}
        rowIndex={rowIndex}
        toggleCardPriority={toggleCardPriority}
        toggleCardCompleted={toggleCardCompleted}
        updateCardDate={updateCardDate}
      />
      <CardTitle
        card={card}
        columnId={columnId}
        rowIndex={rowIndex}
        updateCardTitle={updateCardTitle}
      />
      <div className="flex items-center justify-between">
        <Tags
          tags={card.tags}
          availableTags={availableTags}
          updateCardTags={(newTags) => updateCardTags(card.id, columnId, rowIndex, newTags)}
          addNewTag={addNewTag}
        />
      </div>
    </div>
  );
};
