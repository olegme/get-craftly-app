# Copilot Instructions

## Overview

- Use 'gh' command to manage GitHub issues and pull requests.
- Use 'git' command to manage local and remote repositories.
- Use one-line messages for git commits.
- When I ask you to prepare for commit, make a summary of all changes since the last commit. Add an entry to docs/CHANGES.md with the date and a summary of changes. Stage all modified files, and commit with the summary after I explicitly order you to do so.


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