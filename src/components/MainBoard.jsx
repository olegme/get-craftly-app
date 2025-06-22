import React, { useState } from 'react';
import { Plus, MoreHorizontal, Calendar } from 'lucide-react';

const MainBoard = () => {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverInfo, setDragOverInfo] = useState({ columnId: null, rowIndex: null });

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
              category: 'Research',
              categoryColor: 'bg-red-100 text-red-600',
              date: 'Aug 10'
            },
            {
              id: 'card2',
              title: 'Research competitor CRM features and user feedback',
              category: 'Research',
              categoryColor: 'bg-blue-100 text-blue-600',
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
              category: 'UX',
              categoryColor: 'bg-green-100 text-green-600',
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
              category: 'Design',
              categoryColor: 'bg-purple-100 text-purple-600',
              date: 'Aug 15'
            }
          ]
        },
        {
          cards: [
            {
              id: 'card5',
              title: 'Create high-fidelity mockups for core CRM functionalities',
              category: 'Design',
              categoryColor: 'bg-purple-100 text-purple-600',
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
              category: 'Backend',
              categoryColor: 'bg-yellow-100 text-yellow-700',
              date: 'Aug 20'
            }
          ]
        },
        {
          cards: [
            {
              id: 'card7',
              title: 'Develop task management features (CRUD operations)',
              category: 'Frontend',
              categoryColor: 'bg-orange-100 text-orange-600',
              date: 'Aug 22'
            }
          ]
        },
        {
          cards: [
            {
              id: 'card8',
              title: 'Integrate external payment gateway for subscription model',
              category: 'Integration',
              categoryColor: 'bg-pink-100 text-pink-600',
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
              category: 'QA',
              categoryColor: 'bg-teal-100 text-teal-600',
              date: 'Aug 28'
            }
          ]
        },
        {
          cards: [
            {
              id: 'card10',
              title: 'Perform end-to-end testing of CRM workflow',
              category: 'E2E',
              categoryColor: 'bg-indigo-100 text-indigo-600',
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

  const handleDragStart = (e, card, columnId, rowIndex) => {
    setDraggedItem({ card, sourceColumn: columnId, sourceRow: rowIndex });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId, rowIndex) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverInfo({ columnId, rowIndex });
  };

  const handleDragLeave = () => {
    setDragOverInfo({ columnId: null, rowIndex: null });
  };

  const handleDrop = (e, targetColumnId, targetRowIndex) => {
    e.preventDefault();
    if (!draggedItem) return;

    const { card, sourceColumn, sourceRow } = draggedItem;
    
    if (sourceColumn === targetColumnId && sourceRow === targetRowIndex) {
      setDraggedItem(null);
      setDragOverInfo({ columnId: null, rowIndex: null });
      return;
    }

    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      
      // Remove from source
      const sourceColumnIndex = newColumns.findIndex(col => col.id === sourceColumn);
      newColumns[sourceColumnIndex].rows[sourceRow].cards = 
        newColumns[sourceColumnIndex].rows[sourceRow].cards.filter(c => c.id !== card.id);
      
      // Add to target
      const targetColumnIndex = newColumns.findIndex(col => col.id === targetColumnId);
      newColumns[targetColumnIndex].rows[targetRowIndex].cards.push(card);
      
      return newColumns;
    });

    setDraggedItem(null);
    setDragOverInfo({ columnId: null, rowIndex: null });
  };

  const Card = ({ card, columnId, rowIndex }) => (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, card, columnId, rowIndex)}
      className="bg-white rounded-lg border border-gray-200 p-3 mb-3 cursor-move hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <input type="checkbox" defaultChecked={card.completed} className="mt-1 rounded" />
        {card.priority && (
          <span className={`text-xs font-medium ${card.priorityColor}`}>
            {card.priority}
          </span>
        )}
      </div>
      
      <p className="text-sm text-gray-800 mb-3 leading-relaxed">
        {card.title}
      </p>
      
      <div className="flex items-center justify-between">
        <span className={`px-2 py-1 rounded text-xs font-medium ${card.categoryColor}`}>
          {card.category}
        </span>
        <div className="flex items-center text-xs text-gray-500">
          <Calendar className="w-3 h-3 mr-1" />
          {card.date}
        </div>
      </div>
    </div>
  );

  const AddTaskButton = ({ columnId, rowIndex }) => (
    <button
      className="w-full p-2 text-left text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center"
      onClick={() => {
        // Add new task logic here
        console.log(`Add task to column ${columnId}, row ${rowIndex}`);
      }}
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
              
              {column.rows.map((row, rowIndex) => {
                const rowNames = ['In the works', 'Planned', 'Completed'];
                return (
                  <div key={rowIndex} className="mb-6 bg-white rounded-lg border border-gray-200 p-3">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        {rowNames[rowIndex]}
                      </span>
                    </div>
                    
                    <div
                      className={`min-h-20 rounded-lg p-2 transition-colors ${
                        dragOverInfo.columnId === column.id && dragOverInfo.rowIndex === rowIndex
                          ? 'bg-blue-50 border-2 border-blue-200 border-dashed'
                          : 'bg-gray-50'
                      }`}
                      onDragOver={(e) => handleDragOver(e, column.id, rowIndex)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, column.id, rowIndex)}
                    >
                      {row.cards.map((card) => (
                        <Card 
                          key={card.id} 
                          card={card} 
                          columnId={column.id} 
                          rowIndex={rowIndex}
                        />
                      ))}
                      
                      <AddTaskButton columnId={column.id} rowIndex={rowIndex} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainBoard;