import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus } from 'lucide-react';
import { DraggableCard } from './Card/DraggableCard';
import { DropZone } from './Board/DropZone';
import { ColumnHeader } from './Board/ColumnHeader';

const MainBoard = () => {
  const [columns, setColumns] = useState([
    {
      id: 'discovery',
      title: 'Project Discovery',
      rows: [
        { 
          title: 'WIP',
          cards: [
            {
              id: 'card1',
              title: 'Conduct stakeholder interviews for new CRM feature',
              priority: 'High Priority',
              priorityColor: 'text-red-500',
              tags: [{ name: 'Research', color: 'bg-red-100 text-red-600' }],
              date: 'Aug 10'
            },
          ]
        },
        { 
          title: 'Planned',
          cards: [
            {
              id: 'card2',
              title: 'Research competitor CRM features and user feedback',
              tags: [{ name: 'Research', color: 'bg-blue-100 text-blue-600' }],
              date: 'Aug 12'
            }
          ]
        },
        { 
          title: 'Done',
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
          title: 'WIP',
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
          title: 'Planned',
          cards: [
            {
              id: 'card5',
              title: 'Create high-fidelity mockups for core CRM functionalities',
              tags: [{ name: 'Design', color: 'bg-purple-100 text-purple-600' }],
              date: 'Aug 18'
            }
          ]
        },
        { title: 'Done', cards: [] }
      ]
    },
    {
      id: 'development',
      title: 'Development Backlog',
      rows: [
        { 
          title: 'WIP',
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
          title: 'Planned',
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
          title: 'Done',
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
          title: 'WIP',
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
          title: 'Planned',
          cards: [
            {
              id: 'card10',
              title: 'Perform end-to-end testing of CRM workflow',
              tags: [{ name: 'E2E', color: 'bg-indigo-100 text-indigo-600' }],
              date: 'Aug 30'
            }
          ]
        },
        { title: 'Done', cards: [] }
      ]
    },
    {
      id: 'deployment',
      title: 'Deployment',
      rows: [
        { title: 'WIP', cards: [] },
        { title: 'Planned', cards: [] },
        { title: 'Done', cards: [] },
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

  const updateColumnTitle = (columnId, newTitle) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const columnIndex = newColumns.findIndex(col => col.id === columnId);
      newColumns[columnIndex].title = newTitle;
      return newColumns;
    });
  };

  const addLane = (columnId) => {
    const newLane = {
      id: `new-lane-${Date.now()}`,
      title: 'New Lane',
      rows: [ { title: 'WIP', cards: [] }, { title: 'Planned', cards: [] }, { title: 'Done', cards: [] } ],
    };
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const columnIndex = newColumns.findIndex(col => col.id === columnId);
      newColumns.splice(columnIndex + 1, 0, newLane);
      return newColumns;
    });
  };

  const deleteLane = () => {
    // Placeholder for delete lane logic
    console.log("Delete lane clicked");
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
              <ColumnHeader 
                title={column.title} 
                updateColumnTitle={(newTitle) => updateColumnTitle(column.id, newTitle)}
                addLane={() => addLane(column.id)}
                deleteLane={deleteLane}
              />
              
              {column.rows.map((row, rowIndex) => (
                <div key={rowIndex} className="mb-6 bg-white rounded-lg border border-gray-200 p-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      {row.title}
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
