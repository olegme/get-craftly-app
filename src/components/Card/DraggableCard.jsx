import React from 'react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { Tags } from './Tags';
import { CardTitle } from './CardTitle';
import { CardHeader } from './CardHeader';
import './DraggableCard.css';

// Context to provide rows from Lane
const RowsContext = React.createContext();

export const DraggableCard = ({ card, columnId, rows, updateCardTitle, updateCardTags, availableTags, addNewTag, toggleCardPriority, toggleCardCompleted, updateCardDate }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: () => {
      // Compute the current rowIndex for this card at drag start
      const sourceRowIndex = rows.findIndex(row => row.cards.some(c => c.id === card.id));
      const dragItem = { ...card, sourceColumnId: columnId, sourceRowIndex };
      return dragItem;
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [card, columnId, rows]);

  const sourceRowIndex = rows.findIndex(row => row.cards.some(c => c.id === card.id));
  const cardBg = card.color ? card.color : 'bg-white';

  return (
    <div
      ref={drag}
      data-card-id={card.id}
      data-card-title={card.title}
      data-card-completed={card.completed ? 'true' : 'false'}
      data-testid="card"
      className={`${cardBg} rounded-lg border border-gray-200 p-3 mb-3 cursor-move hover:shadow-md transition-shadow ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <CardHeader
        card={card}
        columnId={columnId}
        rowIndex={sourceRowIndex}
        toggleCardPriority={toggleCardPriority}
        toggleCardCompleted={toggleCardCompleted}
        updateCardDate={updateCardDate}
      />
      <CardTitle
        card={card}
        columnId={columnId}
        rowIndex={sourceRowIndex}
        updateCardTitle={updateCardTitle}
      />
      <div className="flex items-center justify-between">
        <Tags
          tags={card.tags}
          availableTags={availableTags}
          updateCardTags={(newTags) => updateCardTags(card.id, columnId, sourceRowIndex, newTags)}
          addNewTag={addNewTag}
        />
      </div>
    </div>
  );
};
