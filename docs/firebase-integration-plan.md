# Firebase Integration Plan

This document outlines the high-level plan for integrating Firebase into the application to persist board data.

## 1. Firebase Project Setup

*   Create a new project in the [Firebase Console](https://console.firebase.google.com/).
*   Enable **Firestore** as the database.
*   Enable **Authentication** if user-specific boards are required.
*   Create a new web app in the project settings and copy the Firebase configuration.

## 2. Firebase Configuration in the React App

*   Install the `firebase` package: `npm install firebase`
*   Create a new file `src/firebase.js` to initialize Firebase with the configuration from the previous step.
*   Export the Firestore instance from this file.

## 3. Data Modeling in Firestore

The board data will be stored in a Firestore collection called `boards`. Each document in this collection will represent a single board and will have the following structure:

```json
{
  "lanes": [
    {
      "id": "lane-1",
      "title": "To Do",
      "rows": [
        {
          "id": "row-1",
          "title": "High Priority",
          "cards": [
            {
              "id": "card-1",
              "title": "Implement Firebase integration",
              "description": "...",
              "tags": ["backend"],
              "priority": true,
              "completed": false,
              "date": "2025-07-10"
            }
          ]
        },
        { "id": "row-2", "title": "Medium Priority", "cards": [] },
        { "id": "row-3", "title": "Low Priority", "cards": [] }
      ]
    }
  ]
}
```

## 4. API Layer

*   Create a new file `src/api/firebase.js` to handle all interactions with Firestore.
*   This file will contain functions for:
    *   `getBoard(boardId)`: Fetches a board from Firestore.
    *   `updateBoard(boardId, boardData)`: Updates a board in Firestore.
    *   `addCard(boardId, laneId, rowId, cardData)`: Adds a new card to a row.
    *   `updateCard(boardId, cardId, cardData)`: Updates a card.
    *   `deleteCard(boardId, cardId)`: Deletes a card.
    *   `addLane(boardId, laneData)`: Adds a new lane.
    *   `deleteLane(boardId, laneId)`: Deletes a lane.

## 5. Component Integration

*   Refactor the `MainBoard.jsx` component to fetch the board data from Firestore using the `getBoard` function from the API layer.
*   Use `useEffect` to fetch the data when the component mounts.
*   Use `useState` to store the board data.
*   Update the component to use the API functions to modify the board data (e.g., `addCard`, `updateCard`, etc.).
*   Implement real-time updates using Firestore's `onSnapshot` feature to automatically update the UI when the data changes in the database.

## 6. Authentication (Optional)

*   If user-specific boards are required, implement Firebase Authentication.
*   Use FirebaseUI for a pre-built authentication UI.
*   Protect the Firestore rules to ensure that users can only access their own boards.

This plan provides a clear roadmap for integrating Firebase into the application. By following these steps, we can successfully persist user data and enable real-time collaboration.
