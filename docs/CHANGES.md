## 2025-07-22

### Features
- **Deployment:** Added a new npm script to automate the deployment process and create a git tag on each successful deployment.

### Revert
- Reverted changes related to the colorful design.

## 2025-07-14

### Features
- **Deployment:** Deployed the application to Firebase Hosting, making it accessible online.

### Bug Fixes
- Set the default date for new cards to empty instead of the current date.
- Fixed a bug that prevented card date changes from being saved to Firestore.
- Fixed linting errors in `src/components/MainBoard.jsx`.
- **Styling:** Restored Tailwind CSS import in `src/App.css` to fix missing styles.

### Refactoring & Cleanup
- Moved inline styles from `src/App.jsx` to `src/App.css`.
- Moved inline styles from `src/components/Card/DraggableCard.jsx` to `src/components/Card/DraggableCard.css`.
- Removed redundant inline style from `src/components/MainBoard.jsx`.

## 2025-07-13

### Bug Fixes
- Fixed issue where new cards were not being saved to Firestore by ensuring the local state update in `src/components/MainBoard.jsx` correctly places the new card in the respective row and passing the updated state directly to `src/api/board.js` for persistence.
- Removed debug logging from `src/api/board.js`.

### Refactoring & Cleanup
- Removed all debug logging from `src/api/board.js` and `src/components/MainBoard.jsx`.

### Features
- **Authentication and Firebase Integration:** Implemented Firebase authentication, including email/password and Google sign-in. Added registration, login, error display, and modal state handling.
- **Environment Variables:** Moved Firebase secrets to `.env` and refactored `src/firebase.js` to use environment variables.
- **Board Ownership:** Updated board ownership logic.
- **UI/UX:** Aligned sign-in buttons and fixed linting errors.

### UI Enhancements
- Aligned the 'Sign In' buttons in a row and applied a consistent style for a cleaner look in `src/App.jsx`.

### Bug Fixes
- Resolved multiple linting errors in `src/components/MainBoard.jsx` that were preventing the application from building successfully.

## 2025-07-12

### Refactoring & Cleanup
- Removed all console logging from MainBoard.jsx for a cleaner browser console.
- Updated MainBoardWrapper to accept and forward the user prop.
- Ensured all board saves set the owner field for correct Firestore permissions.
- Minor export fix in firebase.js for consistent Firebase usage.
# Changelog

## Session at 2025-06-28

### Features

*   **Drag and Drop:** Replaced the native HTML5 Drag and Drop API with `react-dnd` for a more robust and extensible solution.
*   **In-Place Editing:** Implemented in-place editing for card and lane titles, allowing for a more dynamic and user-friendly experience.
*   **Tag Management:** Added a comprehensive tag management system that allows users to add, remove, and create new tags with assigned colors.
*   **Lane Management:** Implemented the ability to add and delete lanes, giving users more control over their workflow.

### Refactoring

*   **Component-Based Architecture:** Refactored the main board into smaller, more manageable components (`DraggableCard`, `Tags`, `DropZone`, `ColumnHeader`) to improve code organization, readability, and maintainability.

### Bug Fixes

*   **Card Data Restoration:** Restored the initial card data that was accidentally removed during a previous update.

## Session at 2025-06-29

### Features

*   **Card Layout:** Moved the date field to the upper right corner of the card in `DraggableCard.jsx` for improved visual layout.
*   **Priority Flag:** Implemented a toggleable priority flag using boolean state, replacing the text field with `Flag` and `FlagOff` icons in `DraggableCard.jsx` and updating state management in `MainBoard.jsx` and `api/board.js`.
*   **Card Completion:** Implemented automatic movement of cards to the 'Done' row within the same lane when their completion status is toggled in `DraggableCard.jsx` and `MainBoard.jsx`.
*   **Data Consistency:** Ensured data consistency on initial load by marking cards in 'Done' rows as completed in `MainBoard.jsx`.
*   **Drag and Drop Completion:** Ensured that dragging a card to a 'Done' row automatically updates its completion status in `MainBoard.jsx`.
*   **Add Card Functionality:** Refactored 'Add Task' button to dynamically display an input field and save/cancel buttons upon click, improving user experience for adding new cards in `MainBoard.jsx`.


## Session at 2025-07-12

### Features

*   **Calendar Pop-up for Card Date:** Added a calendar pop-up to cards for date selection and clearing. The date field now updates immediately when a date is picked or cleared. Fixed bug where date field was not updating due to missing prop in parent component.


## Session at 2025-07-12

### Features

*   **Firebase Integration:** Installed Firebase package, added Firebase config, and initialized Firestore in `src/firebase.js`.
*   **Firestore Data Modeling:** Created a test board document in Firestore with lanes, cards, and tags using `src/scripts/createTestBoard.js`.

*   **Firestore API Layer:** Implemented board data access and manipulation functions in `src/api/board.js` (fetch, save, update, delete for boards, lanes, and cards).

*   **Firestore API Integration:** Connected React board UI in `MainBoard.jsx` to Firestore API layer for live board, lane, and card updates.

### Security & Refactoring

*   **Firebase Secrets Cleanup:** Moved all Firebase config values to `.env` and refactored `src/firebase.js` to use environment variables. Added `.env` and `src/firebase.js` to `.gitignore` for security.

## 2025-07-13

### Bug Fixes
- Ensured `moveCard` in `src/components/MainBoard.jsx` uses the latest column data for persistence.
- Corrected `toggleCardPriority` in `src/components/MainBoard.jsx` to pass the actual priority value to the backend.
- Corrected `toggleCardCompleted` in `src/components/MainBoard.jsx` to pass the actual completed status to the backend.
- Added persistence for date changes in `updateCardDate` within `src/components/MainBoard.jsx`.
- Fixed `TypeError: lane.cards is not iterable` in `src/api/board.js` by ensuring `lane.cards` is always an array before iteration.
- Fixed `TypeError: board.lanes is not iterable` in `src/api/board.js` by ensuring `board.lanes` is always an array before iteration.