import React, { useState, useEffect, useRef } from 'react';
import { Plus, MoreHorizontal, Calendar, X } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  CARD: 'card',
};

const Tags = ({
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


const DraggableCard = ({ card, columnId, rowIndex, updateCardTitle, updateCardTags, availableTags, addNewTag }) => {
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
        <input type="checkbox" defaultChecked={card.completed} className="mt-1 rounded" />
        {card.priority && (
          <span className={`text-xs font-medium ${card.priorityColor}`}>
            {card.priority}
          </span>
        )}
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
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          {card.date}
        </div>
      </div>
    </div>
  );
};

const DropZone = ({ children, columnId, rowIndex, moveCard }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.CARD,
    drop: (item) => moveCard(item, columnId, rowIndex),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`min-h-20 rounded-lg p-2 transition-colors ${
        isOver ? 'bg-blue-50 border-2 border-blue-200 border-dashed' : 'bg-gray-50'
      }`}
    >
      {children}
    </div>
  );
};

const MainBoard = () => {
  const [columns, setColumns] = useState([
    {
      id: 'discovery',
      title: 'Project Discovery',
      rows: [
        {
          cards: [
            {
              id: 'card1',
              title: 'Conduct stakeholder interviews for new CRM feature',
              priority: 'High Priority',
              priorityColor: 'text-red-500',
              tags: [{ name: 'Research', color: 'bg-red-100 text-red-600' }],
              date: 'Aug 10'
            },
            {
              id: 'card2',
              title: 'Research competitor CRM features and user feedback',
              tags: [{ name: 'Research', color: 'bg-blue-100 text-blue-600' }],
              date: 'Aug 12'
            }
          ]
        },
        { cards: [] },
        {
          cards: [
            {
              id: 'card3',
              title: 'Define user personas and journey maps for improved UX',
              tags: [{ name: 'UX', color: 'bg-green-100 text-green-600' }],
              date: 'Aug 14',
              completed: true
            }
          ]
        }
      ]
    },
    {
      id: 'design',
      title: 'Design & Prototyping',
      rows: [
        {
          cards: [
            {
              id: 'card4',
              title: 'Sketch initial wireframes for CRM dashboard UI',
              tags: [{ name: 'Design', color: 'bg-purple-100 text-purple-600' }],
              date: 'Aug 15'
            }
          ]
        },
        {
          cards: [
            {
              id: 'card5',
              title: 'Create high-fidelity mockups for core CRM functionalities',
              tags: [{ name: 'Design', color: 'bg-purple-100 text-purple-600' }],
              date: 'Aug 18'
            }
          ]
        },
        { cards: [] }
      ]
    },
    {
      id: 'development',
      title: 'Development Backlog',
      rows: [
        {
          cards: [
            {
              id: 'card6',
              title: 'Implement user authentication module (API & UI)',
              tags: [{ name: 'Backend', color: 'bg-yellow-100 text-yellow-700' }],
              date: 'Aug 20'
            }
          ]
        },
        {
          cards: [
            {
              id: 'card7',
              title: 'Develop task management features (CRUD operations)',
              tags: [{ name: 'Frontend', color: 'bg-orange-100 text-orange-600' }],
              date: 'Aug 22'
            }
          ]
        },
        {
          cards: [
            {
              id: 'card8',
              title: 'Integrate external payment gateway for subscription model',
              tags: [{ name: 'Integration', color: 'bg-pink-100 text-pink-600' }],
              date: 'Aug 25'
            }
          ]
        }
      ]
    },
    {
      id: 'testing',
      title: 'Testing & QA',
      rows: [
        {
          cards: [
            {
              id: 'card9',
              title: 'Write unit tests for authentication and task APIs',
              tags: [{ name: 'QA', color: 'bg-teal-100 text-teal-600' }],
              date: 'Aug 28'
            }
          ]
        },
        {
          cards: [
            {
              id: 'card10',
              title: 'Perform end-to-end testing of CRM workflow',
              tags: [{ name: 'E2E', color: 'bg-indigo-100 text-indigo-600' }],
              date: 'Aug 30'
            }
          ]
        },
        { cards: [] }
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment',
      rows: [
        { cards: [] },
        { cards: [] },
        { cards: [] }
      ]
    }
  ]);

  const [availableTags, setAvailableTags] = useState([
    { name: 'Research', color: 'bg-red-100 text-red-600' },
    { name: 'UX', color: 'bg-green-100 text-green-600' },
    { name: 'Design', color: 'bg-purple-100 text-purple-600' },
    { name: 'Backend', color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Frontend', color: 'bg-orange-100 text-orange-600' },
    { name: 'Integration', color: 'bg-pink-100 text-pink-600' },
    { name: 'QA', color: 'bg-teal-100 text-teal-600' },
    { name: 'E2E', color: 'bg-indigo-100 text-indigo-600' },
  ]);

  const addNewTag = (newTag) => {
    setAvailableTags(prev => [...prev, newTag]);
  };

  const moveCard = (draggedCard, targetColumnId, targetRowIndex) => {
    setColumns((prevColumns) => {
      const newColumns = JSON.parse(JSON.stringify(prevColumns));
      
      const { sourceColumnId, sourceRowIndex } = draggedCard;

      const sourceColumn = newColumns.find(c => c.id === sourceColumnId);
      const card = sourceColumn.rows[sourceRowIndex].cards.find(c => c.id === draggedCard.id);

      if (!card) return prevColumns;

      sourceColumn.rows[sourceRowIndex].cards = sourceColumn.rows[sourceRowIndex].cards.filter(c => c.id !== draggedCard.id);
      
      const targetColumn = newColumns.find(c => c.id === targetColumnId);
      targetColumn.rows[targetRowIndex].cards.push(card);
      
      return newColumns;
    });
  };

  const updateCardTitle = (cardId, columnId, rowIndex, newTitle) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const columnIndex = newColumns.findIndex(col => col.id === columnId);
      const cardIndex = newColumns[columnIndex].rows[rowIndex].cards.findIndex(card => card.id === cardId);
      newColumns[columnIndex].rows[rowIndex].cards[cardIndex].title = newTitle;
      return newColumns;
    });
  };

  const updateCardTags = (cardId, columnId, rowIndex, newTags) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const columnIndex = newColumns.findIndex(col => col.id === columnId);
      const cardIndex = newColumns[columnIndex].rows[rowIndex].cards.findIndex(card => card.id === cardId);
      newColumns[columnIndex].rows[rowIndex].cards[cardIndex].tags = newTags;
      return newColumns;
    });
  };

  const AddTaskButton = ({ columnId, rowIndex }) => (
    <button
      className="w-full p-2 text-left text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
      onClick={() => console.log(`Add task to column ${columnId}, row ${rowIndex}`)}
    >
      <Plus className="w-4 h-4 mr-2" />
      Add task
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex gap-6 overflow-x-auto pb-6 w-full justify-center items-start" style={{display: 'flex', justifyContent: 'center'}}>
        {columns.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-gray-800">{column.title}</h2>
                <MoreHorizontal className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
              </div>
              
              {column.rows.map((row, rowIndex) => (
                <div key={rowIndex} className="mb-6 bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Row {rowIndex + 1}
                    </span>
                  </div>
                  
                  <DropZone columnId={column.id} rowIndex={rowIndex} moveCard={moveCard}>
                    {row.cards.map((card) => (
                      <DraggableCard 
                        key={card.id} 
                        card={card} 
                        columnId={column.id} 
                        rowIndex={rowIndex}
                        updateCardTitle={updateCardTitle}
                        updateCardTags={updateCardTags}
                        availableTags={availableTags}
                        addNewTag={addNewTag}
                      />
                    ))}
                    <AddTaskButton columnId={column.id} rowIndex={rowIndex} />
                  </DropZone>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MainBoardWrapper = () => (
  <DndProvider backend={HTML5Backend}>
    <MainBoard />
  </DndProvider>
);

export default MainBoardWrapper;
