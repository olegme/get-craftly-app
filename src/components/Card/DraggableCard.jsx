import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { Tags } from './Tags';
import { CardTitle } from './CardTitle';
import { CardHeader } from './CardHeader';
import './DraggableCard.css';

// Context to provide rows from Lane
const RowsContext = React.createContext();

export const DraggableCard = ({ card, columnId, rows, moveCard, updateCardTitle, updateCardTags, availableTags, addNewTag, toggleCardPriority, toggleCardCompleted, updateCardDate }) => {
  const cardRef = useRef(null);
  const sourceRowIndex = rows.findIndex(row => row.cards.some(c => c.id === card.id));
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
  const [{ isOver, placement }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item, monitor) => {
      if (item.id === card.id) return;

      const bounds = cardRef.current?.getBoundingClientRect();
      const pointer = monitor.getClientOffset();
      const dropPlacement = bounds && pointer && pointer.y < bounds.top + bounds.height / 2
        ? 'before'
        : 'after';
      moveCard(item, columnId, sourceRowIndex, card.id, dropPlacement);
    },
    collect: (monitor) => {
      const bounds = cardRef.current?.getBoundingClientRect();
      const pointer = monitor.getClientOffset();
      return {
        isOver: monitor.isOver({ shallow: true }),
        placement: bounds && pointer && pointer.y < bounds.top + bounds.height / 2
          ? 'before'
          : 'after',
      };
    },
  }), [card.id, columnId, moveCard, sourceRowIndex]);

  const cardBg = card.color ? card.color : 'bg-white';
  drag(drop(cardRef));

  return (
    <div
      ref={cardRef}
      data-card-id={card.id}
      data-card-title={card.title}
      data-card-completed={card.completed ? 'true' : 'false'}
      data-testid="card"
      className={`${cardBg} rounded-lg border border-gray-200 p-3 mb-3 cursor-move hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${
        isOver && placement === 'before'
          ? 'border-t-4 border-t-blue-500'
          : isOver && placement === 'after'
            ? 'border-b-4 border-b-blue-500'
            : ''
      }`}
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
