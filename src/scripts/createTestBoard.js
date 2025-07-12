// src/scripts/createTestBoard.js
import { db } from '../firebase.js';
import { collection, doc, setDoc } from 'firebase/firestore';

async function createTestBoard() {
  const boardId = 'test-board-1';
  const boardRef = doc(collection(db, 'boards'), boardId);
  const boardData = {
    name: 'Demo Board',
    lanes: [
      {
        id: 'lane-1',
        title: 'To Do',
        cards: [
          {
            id: 'card-1',
            title: 'Set up project',
            date: null,
            priority: false,
            completed: false,
            tags: ['setup']
          }
        ]
      },
      {
        id: 'lane-2',
        title: 'Done',
        cards: []
      }
    ],
    tags: [
      { id: 'setup', name: 'Setup', color: '#38bdf8' }
    ]
  };
  await setDoc(boardRef, boardData);
  console.log('Test board created in Firestore.');
}

createTestBoard().catch(console.error);
