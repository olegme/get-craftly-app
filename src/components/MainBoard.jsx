import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus } from 'lucide-react';
import { DraggableCard } from './Card/DraggableCard';
import { DropZone } from './Board/DropZone';
import { ColumnHeader } from './Board/ColumnHeader';
import { getBoardData } from '../api/board';

const MainBoard = () => {
  const [columns, setColumns] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    getBoardData().then(data => {
      setColumns(data.columns);
      setAvailableTags(data.availableTags);
    });
  }, []);

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
