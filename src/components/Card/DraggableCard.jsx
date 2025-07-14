import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Calendar, Flag, FlagOff, CheckSquare, Square } from 'lucide-react';
import { useDrag } from 'react-dnd';
import { ItemTypes } from './ItemTypes';
import { Tags } from './Tags';
import './DraggableCard.css';

export const DraggableCard = ({ card, columnId, rowIndex, updateCardTitle, updateCardTags, availableTags, addNewTag, toggleCardPriority, toggleCardCompleted, updateCardDate }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(card.date ? parseDate(card.date) : null);

  // Helper to parse date string in format 'Mon DD' or ISO
  function parseDate(dateStr) {
    if (!dateStr) return null;
    // Try ISO first
    const iso = Date.parse(dateStr);
    if (!isNaN(iso)) return new Date(iso);
    // Try 'Mon DD' (e.g. 'Jul 12')
    const parts = dateStr.split(' ');
    if (parts.length === 2) {
      const month = parts[0];
      const day = parseInt(parts[1], 10);
      const year = new Date().getFullYear();
      return new Date(`${month} ${day}, ${year}`);
    }
    return null;
  }
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
        {
          card.completed ? (
            <CheckSquare
              className="w-4 h-4 mr-1 text-green-500 cursor-pointer"
              onClick={() => toggleCardCompleted(card.id, columnId, rowIndex)}
            />
          ) : (
            <Square
              className="w-4 h-4 mr-1 text-gray-400 cursor-pointer"
              onClick={() => toggleCardCompleted(card.id, columnId, rowIndex)}
            />
          )
        }

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
        </div>
        <div className="flex items-center text-xs text-gray-500 ml-auto">
          <Calendar className="w-3 h-3 mr-1 cursor-pointer" onClick={() => setShowCalendar(true)} />
          <span className="cursor-pointer" onClick={() => setShowCalendar(true)}>{card.date}</span>
          {showCalendar && (
            <div className="calendar-modal">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  updateCardDate(card.id, columnId, rowIndex, date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '');
                  setShowCalendar(false);
                }}
                inline
                isClearable
                placeholderText="Select date"
              />
              <div className="flex justify-end mt-2 gap-2">
                <button
                  className="px-2 py-1 text-xs font-medium text-red-500 bg-gray-100 rounded hover:bg-gray-200"
                  onClick={() => {
                    setSelectedDate(null);
                    updateCardDate(card.id, columnId, rowIndex, '');
                    setShowCalendar(false);
                  }}
                >Clear</button>
                <button
                  className="px-2 py-1 text-xs font-medium text-gray-500 bg-gray-100 rounded hover:bg-gray-200"
                  onClick={() => setShowCalendar(false)}
                >Close</button>
              </div>
            </div>
          )}
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