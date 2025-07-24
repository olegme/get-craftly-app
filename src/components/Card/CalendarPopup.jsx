import React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const CalendarPopup = ({ card, columnId, rowIndex, updateCardDate, setShowCalendar, selectedDate, setSelectedDate }) => {
  return (
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
  );
};
