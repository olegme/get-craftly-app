import React, { useState, useEffect, useRef } from 'react';

export const Tags = ({
  tags,
  availableTags,
  updateCardTags,
  addNewTag,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [filteredTags, setFilteredTags] = useState(availableTags);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setFilteredTags(availableTags);
  }, [availableTags]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsEditing(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [wrapperRef]);

  const handleTagClick = () => {
    setIsEditing(true);
  };

  const handleTagChange = (tag) => {
    const newTags = tags.some(t => t.name === tag.name)
      ? tags.filter(t => t.name !== tag.name)
      : [...tags, tag];
    updateCardTags(newTags);
  };

  const handleNewTagChange = (e) => {
    setNewTag(e.target.value);
    setFilteredTags(
      availableTags.filter((tag) =>
        tag.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleNewTagSubmit = (e) => {
    e.preventDefault();
    if (newTag.trim() && !availableTags.find(t => t.name.toLowerCase() === newTag.trim().toLowerCase())) {
      const newTagObject = { name: newTag.trim(), color: getNextColor() };
      addNewTag(newTagObject);
      updateCardTags([...tags, newTagObject]);
    }
    setNewTag('');
  };

  const getNextColor = () => {
    const colors = [
      'bg-red-100 text-red-600',
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-purple-100 text-purple-600',
      'bg-yellow-100 text-yellow-700',
      'bg-orange-100 text-orange-600',
      'bg-pink-100 text-pink-600',
      'bg-teal-100 text-teal-600',
      'bg-indigo-100 text-indigo-600',
    ];
    const usedColors = availableTags.map(t => t.color);
    const availableColors = colors.filter(c => !usedColors.includes(c));
    return availableColors.length > 0 ? availableColors[0] : colors[Math.floor(Math.random() * colors.length)];
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, index) => (
          <span
            key={index}
            onClick={handleTagClick}
            className={`px-2 py-1 rounded text-xs font-medium cursor-pointer ${tag.color}`}
          >
            {tag.name}
          </span>
        ))}
        <button onClick={handleTagClick} className="text-xs text-gray-500 hover:text-gray-700">+ Add</button>
      </div>
      {isEditing && (
        <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200">
          <form onSubmit={handleNewTagSubmit} className="p-2">
            <input
              type="text"
              value={newTag}
              onChange={handleNewTagChange}
              placeholder="Add or find a tag..."
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </form>
          <ul className="py-1">
            {filteredTags.map((tag, index) => (
              <li
                key={index}
                onClick={() => handleTagChange(tag)}
                className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
              >
                <span className={`px-2 py-1 rounded text-xs font-medium ${tag.color}`}>
                  {tag.name}
                </span>
                {tags.some(t => t.name === tag.name) && <span className="text-blue-500">✓</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};