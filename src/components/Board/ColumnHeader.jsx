import React, { useState, useRef, useEffect } from 'react';
import { MoreHorizontal } from 'lucide-react';

export const ColumnHeader = ({ title, updateColumnTitle, addLane, deleteLane }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e) => {
    setNewTitle(e.target.value);
  };

  const handleSave = () => {
    if (newTitle.trim()) {
      updateColumnTitle(newTitle);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
    if (e.key === 'Escape') {
      setNewTitle(title);
      setIsEditing(false);
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="flex items-center justify-between mb-4">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={newTitle}
          onChange={handleTitleChange}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="font-semibold text-gray-800 border-b-2 border-blue-500 focus:outline-none"
        />
      ) : (
        <h2 onClick={handleTitleClick} className="font-semibold text-gray-800 cursor-pointer">
          {title}
        </h2>
      )}
      <div className="relative" ref={menuRef}>
        <MoreHorizontal
          className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700"
          data-testid="lane-menu-toggle"
          onClick={toggleMenu}
        />
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
            <ul className="py-1">
              <li
                onClick={() => {
                  addLane();
                  setMenuOpen(false);
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Add Lane
              </li>
              <li
                onClick={() => {
                  deleteLane();
                  setMenuOpen(false);
                }}
                className="px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
              >
                Delete Lane
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
