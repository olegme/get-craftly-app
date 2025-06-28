import React, { useState } from 'react';
import { Plus, MoreHorizontal, Calendar } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemTypes = {
  CARD: 'card',
};

const DraggableCard = ({ card, columnId, rowIndex }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.CARD,
    item: { ...card, sourceColumnId: columnId, sourceRowIndex: rowIndex },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

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
      <p className="text-sm text-gray-800 mb-3 leading-relaxed">{card.title}</p>
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

  const moveCard = (draggedCard, targetColumnId, targetRowIndex) => {
    setColumns((prevColumns) => {
      const newColumns = JSON.parse(JSON.stringify(prevColumns));
      
      const { sourceColumnId, sourceRowIndex } = draggedCard;

      // Find the card to move
      const sourceColumn = newColumns.find(c => c.id === sourceColumnId);
      const card = sourceColumn.rows[sourceRowIndex].cards.find(c => c.id === draggedCard.id);

      if (!card) return prevColumns;

      // Remove from source
      sourceColumn.rows[sourceRowIndex].cards = sourceColumn.rows[sourceRowIndex].cards.filter(c => c.id !== draggedCard.id);
      
      // Add to target
      const targetColumn = newColumns.find(c => c.id === targetColumnId);
      targetColumn.rows[targetRowIndex].cards.push(card);
      
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
