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
*   **Priority Flag:** Replaced priority text with a red flag icon next to the date field in `DraggableCard.jsx`.