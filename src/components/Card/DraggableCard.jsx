import React, { useState, useEffect, useRef } from 'react';
import { Calendar, Flag, FlagOff } from 'lucide-react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { Tags } from './Tags';

export const DraggableCard = ({ card, columnId, rowIndex, updateCardTitle, updateCardTags, availableTags, addNewTag, toggleCardPriority, toggleCardCompleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const inputRef = useRef(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { ...card, sourceColumnId: columnId, sourceRowIndex: rowIndex },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !isEditing,
  }));

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSave = () => {
    if (title.trim()) {
      updateCardTitle(card.id, columnId, rowIndex, title);
    } else {
      setTitle(card.title);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(card.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      ref={drag}
      className={`bg-white rounded-lg border border-gray-200 p-3 mb-3 cursor-move hover:shadow-md transition-shadow ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      <div className="flex items-start justify-between mb-2">
        <input type="checkbox" checked={card.completed} onChange={() => toggleCardCompleted(card.id, columnId, rowIndex)} className="mt-1 rounded" />
        
        <div className="flex items-center text-xs text-gray-500">
          {
            card.priority ? (
              <Flag
                className="w-3 h-3 mr-1 text-red-500 fill-current cursor-pointer"
                onClick={() => toggleCardPriority(card.id, columnId, rowIndex)}
              />
            ) : (
              <FlagOff
                className="w-3 h-3 mr-1 text-gray-400 cursor-pointer"
                onClick={() => toggleCardPriority(card.id, columnId, rowIndex)}
              />
            )
          }
          <Calendar className="w-3 h-3 mr-1" />
          {card.date}
        </div>
      </div>

      {isEditing ? (
        <>
          <textarea
            ref={inputRef}
            value={title}
            onChange={handleTitleChange}
            onKeyDown={handleKeyDown}
            className="w-full text-sm text-gray-800 mb-2 p-1 border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
          />
          <div className="flex items-center justify-end gap-2 mb-3">
            <button
              onClick={handleSave}
              className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <p
          onClick={handleTitleClick}
          className="text-sm text-gray-800 mb-3 leading-relaxed cursor-pointer"
        >
          {card.title}
        </p>
      )}

      <div className="flex items-center justify-between">
        <Tags
          tags={card.tags}
          availableTags={availableTags}
          updateCardTags={(newTags) => updateCardTags(card.id, columnId, rowIndex, newTags)}
          addNewTag={addNewTag}
        />
        {/* Date div moved */}
      </div>
    </div>
  );
};