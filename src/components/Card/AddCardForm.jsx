import React, { useState } from 'react';
import { Plus } from 'lucide-react';

export const AddCardForm = ({ columnId, rowIndex, addCard }) => {
  const [showInput, setShowInput] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');

  const handleAddTaskClick = () => {
    setShowInput(true);
  };

  const handleSaveTask = () => {
    if (taskTitle.trim()) {
      addCard(columnId, rowIndex, taskTitle);
      setTaskTitle('');
      setShowInput(false);
    }
  };

  const handleCancel = () => {
    setTaskTitle('');
    setShowInput(false);
  };

  return (
    <div className="mt-3">
      {showInput ? (
        <>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md mb-2 text-sm"
            placeholder="New card title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSaveTask();
              }
              if (e.key === 'Escape') {
                handleCancel();
              }
            }}
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSaveTask}
              className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Add
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
        <button
          className="w-full p-2 text-left text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
          onClick={handleAddTaskClick}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add task
        </button>
      )}
    </div>
  );
};
