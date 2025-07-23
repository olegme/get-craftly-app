import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Plus } from 'lucide-react';
import { DraggableCard } from './Card/DraggableCard';
import { DropZone } from './Board/DropZone';
import { ColumnHeader } from './Board/ColumnHeader';
import {
  fetchBoard,
  saveBoard,
  updateLane,
  updateCard,
  addCard as addCardFirestore
} from '../api/board';
import { ConfirmationDialog } from './Board/ConfirmationDialog';

const MainBoard = ({ user }) => {
  // Muted color palette
  const mutedColors = [
    'bg-yellow-50', 'bg-yellow-100', 'bg-yellow-200',
    'bg-green-50', 'bg-green-100', 'bg-green-200',
    'bg-blue-50', 'bg-blue-100', 'bg-blue-200',
    'bg-purple-50', 'bg-purple-100', 'bg-purple-200',
    'bg-pink-50', 'bg-pink-100', 'bg-pink-200',
    'bg-orange-50', 'bg-orange-100', 'bg-orange-200',
    'bg-teal-50', 'bg-teal-100', 'bg-teal-200',
    'bg-lime-50', 'bg-lime-100', 'bg-lime-200',
    'bg-rose-50', 'bg-rose-100', 'bg-rose-200',
    'bg-indigo-50', 'bg-indigo-100', 'bg-indigo-200',
    'bg-cyan-50', 'bg-cyan-100', 'bg-cyan-200',
    'bg-emerald-50', 'bg-emerald-100', 'bg-emerald-200',
    'bg-fuchsia-50', 'bg-fuchsia-100', 'bg-fuchsia-200',
    'bg-sky-50', 'bg-sky-100', 'bg-sky-200',
    'bg-violet-50', 'bg-violet-100', 'bg-violet-200',
    'bg-red-50', 'bg-red-100', 'bg-red-200',
    'bg-gray-50', 'bg-gray-100', 'bg-gray-200',
    'bg-stone-50', 'bg-stone-100', 'bg-stone-200',
    'bg-zinc-50', 'bg-zinc-100', 'bg-zinc-200',
    'bg-neutral-50', 'bg-neutral-100', 'bg-neutral-200',
    'bg-slate-50', 'bg-slate-100', 'bg-slate-200',
  ];

  // Assign a unique color to each column (cycle if more columns than colors)
  // Each column gets a color stored in its object: column.color
  const getColumnColor = (column, idx) => {
    return column.color || mutedColors[idx % mutedColors.length];
  };
  const [columns, setColumns] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [laneToDelete, setLaneToDelete] = useState(null);

  useEffect(() => {
    async function loadBoard() {
      if (!user) return;
      try {
        const data = await fetchBoard(user.uid);
        // Assign different random muted colors to columns if not present
        let lanes = data.lanes || [];
        // Read colors from storage, only assign if missing or invalid
        const usedColors = [];
        lanes = lanes.map((lane, idx) => {
          let color = lane.color;
          if (!color || typeof color !== 'string' || color.trim() === '') {
            const availableColors = mutedColors.filter(c => !usedColors.includes(c));
            if (availableColors.length > 0) {
              color = availableColors[Math.floor(Math.random() * availableColors.length)];
            } else {
              color = mutedColors[idx % mutedColors.length];
            }
          }
          usedColors.push(color);
          return { ...lane, color };
        });
        setColumns(lanes);
        setAvailableTags(data.tags || []);
      } catch (_err) {
        if (
          (_err && _err.message && _err.message.toLowerCase().includes('board not found')) ||
          (typeof _err === 'string' && _err.toLowerCase().includes('board not found'))
        ) {
          const defaultBoard = {
            lanes: [
              {
                id: 'lane-1',
                title: 'To Do',
                rows: [
                  { title: 'WIP', cards: [] },
                  { title: 'Planned', cards: [] },
                  { title: 'Done', cards: [] }
                ]
              }
            ],
            tags: []
          };
          await saveBoard(user.uid, defaultBoard, user.uid);
          try {
            const createdData = await fetchBoard(user.uid);
            // Assign colors to default lanes
            let lanes = createdData.lanes || [];
            const usedColors = [];
            lanes = lanes.map((lane) => {
              const availableColors = mutedColors.filter(c => !usedColors.includes(c));
              const color = availableColors.length > 0
                ? availableColors[Math.floor(Math.random() * availableColors.length)]
                : mutedColors[Math.floor(Math.random() * mutedColors.length)];
              usedColors.push(color);
              return { ...lane, color };
            });
            setColumns(lanes);
            setAvailableTags(createdData.tags || []);
          } catch {
            // Assign colors to defaultBoard.lanes
            let lanes = defaultBoard.lanes;
            const usedColors = [];
            lanes = lanes.map((lane) => {
              const availableColors = mutedColors.filter(c => !usedColors.includes(c));
              const color = availableColors.length > 0
                ? availableColors[Math.floor(Math.random() * availableColors.length)]
                : mutedColors[Math.floor(Math.random() * mutedColors.length)];
              usedColors.push(color);
              return { ...lane, color };
            });
            setColumns(lanes);
            setAvailableTags(defaultBoard.tags);
          }
        }
      }
    }
    loadBoard();
  }, [user]);

  const addNewTag = async (newTag) => {
    setAvailableTags(prev => [...prev, newTag]);
    if (user) await saveBoard(user.uid, { tags: [...availableTags, newTag] }, user.uid);
  };

  const moveCard = async (draggedCard, targetColumnId, targetRowIndex) => {
    // Compute the new state first
    const newColumns = JSON.parse(JSON.stringify(columns)); // Start with current columns state
    const { sourceColumnId, sourceRowIndex } = draggedCard;
    const sourceColumn = newColumns.find(c => c.id === sourceColumnId);
    const card = sourceColumn.rows[sourceRowIndex].cards.find(c => c.id === draggedCard.id);
    if (!card) return; // No card found, nothing to do

    sourceColumn.rows[sourceRowIndex].cards = sourceColumn.rows[sourceRowIndex].cards.filter(c => c.id !== draggedCard.id);
    const targetColumn = newColumns.find(c => c.id === targetColumnId);
    if (targetColumn.rows[targetRowIndex].title === 'Done') {
      card.completed = true;
    } else {
      card.completed = false;
    }
    targetColumn.rows[targetRowIndex].cards.push(card);

    // Update the state
    setColumns(newColumns);

    // Now save the board with the newColumns
    await saveBoard(user.uid, { lanes: newColumns }, user.uid);
  };

  const updateCardTitle = async (cardId, columnId, rowIndex, newTitle) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const columnIndex = newColumns.findIndex(col => col.id === columnId);
      const cardIndex = newColumns[columnIndex].rows[rowIndex].cards.findIndex(card => card.id === cardId);
      newColumns[columnIndex].rows[rowIndex].cards[cardIndex].title = newTitle;
      return newColumns;
    });
    await updateCard(user.uid, columnId, cardId, { title: newTitle });
  };

  const updateCardTags = async (cardId, columnId, rowIndex, newTags) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const columnIndex = newColumns.findIndex(col => col.id === columnId);
      const cardIndex = newColumns[columnIndex].rows[rowIndex].cards.findIndex(card => card.id === cardId);
      newColumns[columnIndex].rows[rowIndex].cards[cardIndex].tags = newTags;
      return newColumns;
    });
    await updateCard(user.uid, columnId, cardId, { tags: newTags });
  };

  const toggleCardPriority = async (cardId, columnId, rowIndex) => {
    setColumns(prevColumns => {
      const newColumns = prevColumns.map(col => {
        if (col.id === columnId) {
          return {
            ...col,
            rows: col.rows.map((row, rIdx) => {
              if (rIdx === rowIndex) {
                return {
                  ...row,
                  cards: row.cards.map(card => {
                    if (card.id === cardId) {
                      return {
                        ...card,
                        priority: !card.priority,
                      };
                    }
                    return card;
                  }),
                };
              }
              return row;
            }),
          };
        }
        return col;
      });
      return newColumns;
    });
    const card = columns.find(col => col.id === columnId).rows[rowIndex].cards.find(c => c.id === cardId);
    await updateCard(user.uid, columnId, cardId, { priority: !card.priority });
  };

  const toggleCardCompleted = async (cardId, columnId, rowIndex) => {
    setColumns(prevColumns => {
      const newColumns = JSON.parse(JSON.stringify(prevColumns)); // Deep copy for easier manipulation
      const columnIndex = newColumns.findIndex(col => col.id === columnId);
      const currentColumn = newColumns[columnIndex];
      const cardToMove = currentColumn.rows[rowIndex].cards.find(card => card.id === cardId);
      if (!cardToMove) return prevColumns; // Card not found
      // Toggle completed status
      cardToMove.completed = !cardToMove.completed;
      // Remove card from current row
      currentColumn.rows[rowIndex].cards = currentColumn.rows[rowIndex].cards.filter(card => card.id !== cardId);
      // Find the 'Done' row (assuming it's always the last row, index 2)
      const doneRowIndex = currentColumn.rows.findIndex(row => row.title === 'Done');
      const wipRowIndex = currentColumn.rows.findIndex(row => row.title === 'WIP');
      if (doneRowIndex === -1 || wipRowIndex === -1) return prevColumns; // 'Done' or 'WIP' row not found
      // Add card to 'Done' row if completed, otherwise move to 'WIP' row
      if (cardToMove.completed) {
        currentColumn.rows[doneRowIndex].cards.push(cardToMove);
      } else {
        currentColumn.rows[wipRowIndex].cards.push(cardToMove);
      }
      return newColumns;
    });
    const card = columns.find(col => col.id === columnId).rows[rowIndex].cards.find(c => c.id === cardId);
    await updateCard(user.uid, columnId, cardId, { completed: !card.completed });
  };

  const updateColumnTitle = async (columnId, newTitle) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const columnIndex = newColumns.findIndex(col => col.id === columnId);
      newColumns[columnIndex].title = newTitle;
      return newColumns;
    });
    await updateLane(user.uid, columnId, { title: newTitle });
  };

  const addLane = async (columnId) => {
    // Find used colors
    const usedColors = columns.map(col => col.color).filter(Boolean);
    // Find available colors
    const availableColors = mutedColors.filter(c => !usedColors.includes(c));
    // Pick a random available color, or fallback to any
    const color = availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : mutedColors[Math.floor(Math.random() * mutedColors.length)];

    const newLane = {
      id: `new-lane-${Date.now()}`,
      title: 'New Lane',
      color,
      rows: [ { title: 'WIP', cards: [] }, { title: 'Planned', cards: [] }, { title: 'Done', cards: [] } ],
    };
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const columnIndex = newColumns.findIndex(col => col.id === columnId);
      newColumns.splice(columnIndex + 1, 0, newLane);
      saveBoard(user.uid, { lanes: newColumns }, user.uid);
      return newColumns;
    });
  };

  const handleDeleteLane = (columnId) => {
    const columnToDelete = columns.find(col => col.id === columnId);
    const hasCards = columnToDelete.rows.some(row => row.cards.length > 0);

    if (hasCards) {
      setLaneToDelete(columnId);
      setDialogOpen(true);
    } else {
      setColumns(prevColumns => {
        const updatedColumns = prevColumns.filter(col => col.id !== columnId);
        saveBoard(user.uid, { lanes: updatedColumns }, user.uid);
        return updatedColumns;
      });
    }
  };

  const confirmDelete = () => {
    setColumns(prevColumns => {
      const updatedColumns = prevColumns.filter(col => col.id !== laneToDelete);
      saveBoard(user.uid, { lanes: updatedColumns }, user.uid);
      return updatedColumns;
    });
    setDialogOpen(false);
    setLaneToDelete(null);
  };

  const cancelDelete = () => {
    setDialogOpen(false);
    setLaneToDelete(null);
  };

  const addCard = async (columnId, rowIndex, title) => {
    if (title.trim() === '') return;
    const newCard = {
      id: `card-${Date.now()}`,
      title: title,
      priority: false,
      tags: [],
      date: '',
      completed: false,
    };
    const newColumns = columns.map(col => {
      if (col.id === columnId) {
        const updatedRows = col.rows.map((row, rIdx) => {
          if (rIdx === rowIndex) {
            return {
              ...row,
              cards: [...row.cards, newCard],
            };
          }
          return row;
        });
        return {
          ...col,
          rows: updatedRows,
        };
      }
      return col;
    });
    setColumns(newColumns);
    await addCardFirestore(user.uid, columnId, newCard, newColumns);
  };

  const AddTaskButton = ({ columnId, rowIndex, addCard }) => {
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

  return (
    <>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex gap-6 overflow-x-auto pb-6 w-full justify-center items-start">
          {columns.map((column, idx) => (
            <div key={column.id} className="flex-shrink-0 w-80">
              <div className={`${getColumnColor(column, idx)} rounded-lg p-4`}>
                <ColumnHeader 
                  title={column.title} 
                  updateColumnTitle={(newTitle) => updateColumnTitle(column.id, newTitle)}
                  addLane={() => addLane(column.id)}
                  deleteLane={() => handleDeleteLane(column.id)}
                />
                {(column.rows || []).map((row, rowIndex) => (
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
                          toggleCardPriority={toggleCardPriority}
                          toggleCardCompleted={toggleCardCompleted}
                          updateCardDate={async (cardId, columnId, rowIndex, newDate) => {
                            setColumns(prevColumns => {
                              const newColumns = [...prevColumns];
                              const columnIndex = newColumns.findIndex(col => col.id === columnId);
                              const cardIndex = newColumns[columnIndex].rows[rowIndex].cards.findIndex(card => card.id === cardId);
                              newColumns[columnIndex].rows[rowIndex].cards[cardIndex].date = newDate;
                              return newColumns;
                            });
                            await updateCard(user.uid, columnId, cardId, { date: newDate });
                          }}
                        />
                      ))}
                      <AddTaskButton columnId={column.id} rowIndex={rowIndex} addCard={addCard} />
                    </DropZone>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ConfirmationDialog 
        isOpen={dialogOpen} 
        onConfirm={confirmDelete} 
        onCancel={cancelDelete} 
        message="This lane contains cards. Are you sure you want to delete it?"
      />
    </>
  );
};

const MainBoardWrapper = ({ user }) => (
  <DndProvider backend={HTML5Backend}>
    <MainBoard user={user} />
  </DndProvider>
);

export default MainBoardWrapper;