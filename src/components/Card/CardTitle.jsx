import React, { useState, useEffect, useRef } from 'react';

export const CardTitle = ({ card, columnId, rowIndex, updateCardTitle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const inputRef = useRef(null);

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
    <>
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
    </>
  );
};
