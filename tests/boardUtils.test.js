import assert from 'node:assert/strict';
import test from 'node:test';
import { applyMoveCard } from '../src/hooks/boardUtils.js';

const baseColumns = () => ([
  {
    id: 'lane-a',
    title: 'MP3 Tag Inspector',
    rows: [
      {
        title: 'WIP',
        cards: [
          { id: 'card-1', title: 'First', completed: true },
        ],
      },
      { title: 'Planned', cards: [] },
      { title: 'Done', cards: [] },
    ],
  },
  {
    id: 'lane-b',
    title: 'Other Lane',
    rows: [
      { title: 'WIP', cards: [] },
      {
        title: 'Planned',
        cards: [
          { id: 'card-2', title: 'Second', completed: false },
        ],
      },
      { title: 'Done', cards: [] },
    ],
  },
]);

test('moving a different card keeps completed cards in Done state', () => {
  const columns = baseColumns();
  // Simulate card-1 already moved to Done with completed=true
  columns[0].rows[0].cards = [];
  columns[0].rows[2].cards = [{ id: 'card-1', title: 'First', completed: true }];

  const draggedCard = { id: 'card-2', title: 'Second', completed: false };
  const result = applyMoveCard(columns, draggedCard, 'lane-b', 0); // Planned -> WIP in lane-b

  assert.equal(result.didMove, true);
  const laneA = result.columns.find(col => col.id === 'lane-a');
  const doneCard = laneA.rows[2].cards.find(card => card.id === 'card-1');
  assert.equal(doneCard.completed, true);
  assert.equal(laneA.rows[2].cards.length, 1);
});

test('moving from Done to WIP clears completion', () => {
  const columns = baseColumns();
  columns[0].rows[0].cards = [];
  columns[0].rows[2].cards = [{ id: 'card-1', title: 'First', completed: true }];

  const draggedCard = { id: 'card-1', title: 'First', completed: true };
  const result = applyMoveCard(columns, draggedCard, 'lane-a', 0); // Done -> WIP

  assert.equal(result.didMove, true);
  const laneA = result.columns.find(col => col.id === 'lane-a');
  const wipCard = laneA.rows[0].cards.find(card => card.id === 'card-1');
  assert.equal(wipCard.completed, false);
});

test('reorders cards within the same priority group', () => {
  const columns = baseColumns();
  columns[0].rows[0].cards = [
    { id: 'priority-a', title: 'Priority A', priority: true },
    { id: 'priority-b', title: 'Priority B', priority: true },
    { id: 'regular-a', title: 'Regular A', priority: false },
    { id: 'regular-b', title: 'Regular B', priority: false },
  ];

  const result = applyMoveCard(
    columns,
    columns[0].rows[0].cards[1],
    'lane-a',
    0,
    'priority-a',
    'before',
  );

  assert.deepEqual(
    result.columns[0].rows[0].cards.map(card => card.id),
    ['priority-b', 'priority-a', 'regular-a', 'regular-b'],
  );
});

test('preserves priority-first ordering when a regular card is dropped before a priority card', () => {
  const columns = baseColumns();
  columns[0].rows[0].cards = [
    { id: 'priority-a', title: 'Priority A', priority: true },
    { id: 'regular-a', title: 'Regular A', priority: false },
    { id: 'regular-b', title: 'Regular B', priority: false },
  ];

  const result = applyMoveCard(
    columns,
    columns[0].rows[0].cards[2],
    'lane-a',
    0,
    'priority-a',
    'before',
  );

  assert.deepEqual(
    result.columns[0].rows[0].cards.map(card => card.id),
    ['priority-a', 'regular-b', 'regular-a'],
  );
});
