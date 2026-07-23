const orderCardsByPriority = (cards, rowTitle) => {
  const normalizedTitle = rowTitle?.toLowerCase();
  if (normalizedTitle !== 'wip' && normalizedTitle !== 'planned') {
    return cards;
  }

  return [
    ...cards.filter(card => card.priority),
    ...cards.filter(card => !card.priority),
  ];
};

export const applyMoveCard = (
  columns,
  draggedCard,
  targetColumnId,
  targetRowIndex,
  targetCardId = null,
  placement = 'after',
) => {
  if (!Array.isArray(columns) || !draggedCard || !draggedCard.id) {
    return { columns, didMove: false };
  }

  const targetColumn = columns.find(col => col.id === targetColumnId);
  if (!targetColumn || !targetColumn.rows || !targetColumn.rows[targetRowIndex]) {
    return { columns, didMove: false };
  }

  let sourceColumnIdx = -1;
  let sourceRowIdx = -1;
  let sourceCardIdx = -1;

  for (let cIdx = 0; cIdx < columns.length; cIdx++) {
    const col = columns[cIdx];
    for (let rIdx = 0; rIdx < col.rows.length; rIdx++) {
      const row = col.rows[rIdx];
      const cardIdx = row.cards.findIndex(c => c.id === draggedCard.id);
      if (cardIdx !== -1) {
        sourceColumnIdx = cIdx;
        sourceRowIdx = rIdx;
        sourceCardIdx = cardIdx;
        break;
      }
    }
    if (sourceColumnIdx !== -1) break;
  }

  if (sourceColumnIdx === -1 || sourceRowIdx === -1 || sourceCardIdx === -1) {
    return { columns, didMove: false };
  }

  const newColumns = JSON.parse(JSON.stringify(columns));
  const sourceColumn = newColumns[sourceColumnIdx];
  const sourceRow = sourceColumn.rows[sourceRowIdx];
  const [card] = sourceRow.cards.splice(sourceCardIdx, 1);
  if (!card) {
    return { columns, didMove: false };
  }

  const updatedTargetColumn = newColumns.find(col => col.id === targetColumnId);
  const updatedTargetRow = updatedTargetColumn.rows[targetRowIndex];

  if (updatedTargetRow.title === 'Done') {
    card.completed = true;
  } else if (updatedTargetRow.title !== 'Done' && sourceRow.title === 'Done') {
    // Only set to false if moving FROM Done to another row
    card.completed = false;
  }

  const targetCardIndex = targetCardId
    ? updatedTargetRow.cards.findIndex(targetCard => targetCard.id === targetCardId)
    : -1;
  const insertionIndex = targetCardIndex === -1
    ? updatedTargetRow.cards.length
    : targetCardIndex + (placement === 'after' ? 1 : 0);

  updatedTargetRow.cards.splice(insertionIndex, 0, card);
  updatedTargetRow.cards = orderCardsByPriority(updatedTargetRow.cards, updatedTargetRow.title);

  return { columns: newColumns, didMove: true };
};
