import React, { useState } from 'react';
import { Calendar, Flag, FlagOff, CheckSquare, Square } from 'lucide-react';
import { CalendarPopup } from './CalendarPopup';

export const CardHeader = ({ card, columnId, rowIndex, toggleCardPriority, toggleCardCompleted, updateCardDate }) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(card.date ? parseDate(card.date) : null);

  function parseDate(dateStr) {
    if (!dateStr) return null;
    const iso = Date.parse(dateStr);
    if (!isNaN(iso)) return new Date(iso);
    const parts = dateStr.split(' ');
    if (parts.length === 2) {
      const month = parts[0];
      const day = parseInt(parts[1], 10);
      const year = new Date().getFullYear();
      return new Date(`${month} ${day}, ${year}`);
    }
    return null;
  }

  return (
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
          <CalendarPopup
            card={card}
            columnId={columnId}
            rowIndex={rowIndex}
            updateCardDate={updateCardDate}
            setShowCalendar={setShowCalendar}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        )}
      </div>
    </div>
  );
};
