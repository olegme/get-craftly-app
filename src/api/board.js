// Firestore API for board data
import { db } from '../firebase.js';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';

const BOARD_COLLECTION = 'boards';

// Fetch a board by ID
export async function fetchBoard(boardId) {
  const boardRef = doc(collection(db, BOARD_COLLECTION), boardId);
  const snap = await getDoc(boardRef);
  if (!snap.exists()) throw new Error('Board not found');
  return snap.data();
}

// Create or update a board
export async function saveBoard(boardId, boardData) {
  const boardRef = doc(collection(db, BOARD_COLLECTION), boardId);
  await setDoc(boardRef, boardData, { merge: true });
}

// Delete a board
export async function deleteBoard(boardId) {
  const boardRef = doc(collection(db, BOARD_COLLECTION), boardId);
  await deleteDoc(boardRef);
}

// List all boards
export async function listBoards() {
  const boardsSnap = await getDocs(collection(db, BOARD_COLLECTION));
  return boardsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Update a lane in a board
export async function updateLane(boardId, laneId, laneData) {
  const boardRef = doc(collection(db, BOARD_COLLECTION), boardId);
  const boardSnap = await getDoc(boardRef);
  if (!boardSnap.exists()) throw new Error('Board not found');
  const board = boardSnap.data();
  const lanes = board.lanes.map(lane => lane.id === laneId ? { ...lane, ...laneData } : lane);
  await updateDoc(boardRef, { lanes });
}

// Update a card in a lane
export async function updateCard(boardId, laneId, cardId, cardData) {
  const boardRef = doc(collection(db, BOARD_COLLECTION), boardId);
  const boardSnap = await getDoc(boardRef);
  if (!boardSnap.exists()) throw new Error('Board not found');
  const board = boardSnap.data();
  const lanes = board.lanes.map(lane =>
    lane.id === laneId
      ? { ...lane, cards: lane.cards.map(card => card.id === cardId ? { ...card, ...cardData } : card) }
      : lane
  );
  await updateDoc(boardRef, { lanes });
}

// Add a new card to a lane
export async function addCard(boardId, laneId, cardData) {
  const boardRef = doc(collection(db, BOARD_COLLECTION), boardId);
  const boardSnap = await getDoc(boardRef);
  if (!boardSnap.exists()) throw new Error('Board not found');
  const board = boardSnap.data();
  const lanes = board.lanes.map(lane =>
    lane.id === laneId
      ? { ...lane, cards: [...lane.cards, cardData] }
      : lane
  );
  await updateDoc(boardRef, { lanes });
}

// Delete a card from a lane
export async function deleteCard(boardId, laneId, cardId) {
  const boardRef = doc(collection(db, BOARD_COLLECTION), boardId);
  const boardSnap = await getDoc(boardRef);
  if (!boardSnap.exists()) throw new Error('Board not found');
  const board = boardSnap.data();
  const lanes = board.lanes.map(lane =>
    lane.id === laneId
      ? { ...lane, cards: lane.cards.filter(card => card.id !== cardId) }
      : lane
  );
  await updateDoc(boardRef, { lanes });
}