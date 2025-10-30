import { useState, useEffect } from 'react';
import {
  fetchBoard,
  saveBoard,
  updateLane,
  updateCard,
  addCard as addCardFirestore
} from '../api/board';

export const useBoard = (user) => {
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
        let lanes = data.lanes || [];
        let boardChanged = false;
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
            boardChanged = true;
          }
          usedColors.push(color);
          const newRows = (lane.rows || []).map(row => {
            const newCards = (row.cards || []).map(card => {
              if (!card.color || typeof card.color !== 'string' || card.color.trim() === '') {
                const cardAvailableColors = mutedColors.filter(c => c !== color);
                const cardColor = cardAvailableColors.length > 0
                  ? cardAvailableColors[Math.floor(Math.random() * cardAvailableColors.length)]
                  : mutedColors[Math.floor(Math.random() * mutedColors.length)];
                boardChanged = true;
                return { ...card, color: cardColor };
              }
              return card;
            });
            return { ...row, cards: newCards };
          });
          return { ...lane, color, rows: newRows };
        });
        
        // Move completed cards to the "Done" row if they're not already there
        lanes = lanes.map(lane => {
          const doneRowIndex = lane.rows.findIndex(row => row.title === 'Done');
          const wipRowIndex = lane.rows.findIndex(row => row.title === 'WIP');
          const plannedRowIndex = lane.rows.findIndex(row => row.title === 'Planned');
          
          if (doneRowIndex !== -1) {
            // Collect all completed cards from all rows
            const completedCards = [];
            const updatedRows = lane.rows.map((row, rowIndex) => {
              const rowCompletedCards = row.cards.filter(card => card.completed);
              const rowNonCompletedCards = row.cards.filter(card => !card.completed);
              
              if (rowCompletedCards.length > 0) {
                completedCards.push(...rowCompletedCards);
                boardChanged = true;
                return { ...row, cards: rowNonCompletedCards };
              }
              return row;
            });
            
            // Add all completed cards to the "Done" row
            if (completedCards.length > 0) {
              updatedRows[doneRowIndex] = { ...updatedRows[doneRowIndex], cards: [...updatedRows[doneRowIndex].cards, ...completedCards] };
            }
            
            return { ...lane, rows: updatedRows };
          }
          return lane;
        });
        
        setColumns(lanes);
        setAvailableTags(data.tags || []);
        if (boardChanged && user) {
          await saveBoard(user.uid, { ...data, lanes }, user.uid);
        }
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
            let lanes = createdData.lanes || [];
            const usedColors = [];
            lanes = lanes.map((lane) => {
              const availableColors = mutedColors.filter(c => !usedColors.includes(c));
              const color = availableColors.length > 0
                ? availableColors[Math.floor(Math.random() * availableColors.length)]
                : mutedColors[Math.floor(Math.random() * mutedColors.length)];
              usedColors.push(color);
              
              // Move completed cards to the "Done" row if they're not already there
              const doneRowIndex = lane.rows.findIndex(row => row.title === 'Done');
              if (doneRowIndex !== -1) {
                const completedCards = [];
                const updatedRows = lane.rows.map((row, rowIndex) => {
                  const rowCompletedCards = row.cards.filter(card => card.completed);
                  const rowNonCompletedCards = row.cards.filter(card => !card.completed);
                  
                  if (rowCompletedCards.length > 0) {
                    completedCards.push(...rowCompletedCards);
                    return { ...row, cards: rowNonCompletedCards };
                  }
                  return row;
                });
                
                if (completedCards.length > 0) {
                  updatedRows[doneRowIndex] = { ...updatedRows[doneRowIndex], cards: [...updatedRows[doneRowIndex].cards, ...completedCards] };
                }
                
                return { ...lane, color, rows: updatedRows };
              }
              return { ...lane, color };
            });
            setColumns(lanes);
            setAvailableTags(createdData.tags || []);
          } catch {
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
    const newColumns = JSON.parse(JSON.stringify(columns));

    // Find the card's current location by id
    let found = false;
    let sourceColumnIdx = -1;
    let sourceRowIdx = -1;
    for (let cIdx = 0; cIdx < newColumns.length; cIdx++) {
      const col = newColumns[cIdx];
      for (let rIdx = 0; rIdx < col.rows.length; rIdx++) {
        const row = col.rows[rIdx];
        const cardIdx = row.cards.findIndex(c => c.id === draggedCard.id);
        if (cardIdx !== -1) {
          sourceColumnIdx = cIdx;
          sourceRowIdx = rIdx;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    if (!found) {
      return;
    }

    const sourceColumn = newColumns[sourceColumnIdx];
    const sourceRow = sourceColumn.rows[sourceRowIdx];
    const card = sourceRow.cards.find(c => c.id === draggedCard.id);
    if (!card) {
      return;
    }
    // Remove from current location
    sourceRow.cards = sourceRow.cards.filter(c => c.id !== draggedCard.id);

    const targetColumn = newColumns.find(c => c.id === targetColumnId);
    if (!targetColumn) {
      return;
    }
    if (!targetColumn.rows[targetRowIndex]) {
      return;
    }
    if (targetColumn.rows[targetRowIndex].title === 'Done') {
      card.completed = true;
    } else {
      card.completed = false;
    }
    targetColumn.rows[targetRowIndex].cards.push(card);
    setColumns(newColumns);
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
      const newColumns = JSON.parse(JSON.stringify(prevColumns));
      const columnIndex = newColumns.findIndex(col => col.id === columnId);
      const currentColumn = newColumns[columnIndex];
      const cardToMove = currentColumn.rows[rowIndex].cards.find(card => card.id === cardId);
      if (!cardToMove) return prevColumns;
      cardToMove.completed = !cardToMove.completed;
      currentColumn.rows[rowIndex].cards = currentColumn.rows[rowIndex].cards.filter(card => card.id !== cardId);
      const doneRowIndex = currentColumn.rows.findIndex(row => row.title === 'Done');
      const wipRowIndex = currentColumn.rows.findIndex(row => row.title === 'WIP');
      if (doneRowIndex === -1 || wipRowIndex === -1) return prevColumns;
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
    const usedColors = columns.map(col => col.color).filter(Boolean);
    const availableColors = mutedColors.filter(c => !usedColors.includes(c));
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
    const column = columns.find(col => col.id === columnId);
    const columnColor = column && column.color;
    const availableColors = mutedColors.filter(c => c !== columnColor);
    const cardColor = availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : mutedColors[Math.floor(Math.random() * mutedColors.length)];
    const newCard = {
      id: `card-${Date.now()}`,
      title: title,
      priority: false,
      tags: [],
      date: '',
      completed: false,
      color: cardColor,
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

  const updateCardDate = async (cardId, columnId, rowIndex, newDate) => {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      const columnIndex = newColumns.findIndex(col => col.id === columnId);
      const cardIndex = newColumns[columnIndex].rows[rowIndex].cards.findIndex(card => card.id === cardId);
      newColumns[columnIndex].rows[rowIndex].cards[cardIndex].date = newDate;
      return newColumns;
    });
    await updateCard(user.uid, columnId, cardId, { date: newDate });
  };

  return {
    columns,
    availableTags,
    dialogOpen,
    laneToDelete,
    getColumnColor,
    addNewTag,
    moveCard,
    updateCardTitle,
    updateCardTags,
    toggleCardPriority,
    toggleCardCompleted,
    updateColumnTitle,
    addLane,
    handleDeleteLane,
    confirmDelete,
    cancelDelete,
    addCard,
    updateCardDate,
  };
};
