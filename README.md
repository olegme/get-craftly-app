# Get Craftly App

## Overview

This is a modern React project scaffolded with Vite and styled using Tailwind CSS v4. It features a kanban-style main board for project/task management, is powered by a Firebase backend, and is configured for rapid local development and clean, responsive UI design.

## End-User Functionality Overview

Craftly is a Kanban-style task management application designed for intuitive and efficient project organization. As an end-user, you can:

*   **Manage Tasks Visually:** Utilize a multi-column board to organize tasks (cards) by status, priority, or any custom categories you define.
*   **Drag and Drop:** Easily move tasks between different columns and rows with a simple drag-and-drop interface.
*   **Edit In-Place:** Directly edit task and column titles on the board for quick updates.
*   **Detailed Task Management:** Each task card supports:
    *   A title for clear identification.
    *   A completion status to track progress.
    *   A priority flag to highlight important tasks.
    *   Customizable tags for categorization and filtering.
    *   A due date selector with a calendar pop-up.
*   **Dynamic Board Customization:** Add new columns (lanes) to tailor the board to your workflow. You can also add new task cards to any column.
*   **Data Persistence:** All your changes, including task movements, edits, and new additions, are automatically saved and synchronized in real-time using Firebase.
*   **Visual Cues:** Columns and cards are assigned unique, muted colors to enhance visual organization and readability.
*   **User Accounts & Board Ownership:** Securely manage your tasks with user authentication (email/password and Google Sign-In). Each user has their own distinct boards, ensuring personalized task management.

## Project Idea

This started as a side project to my other side projects. There is no manual coding involved, I never used React and Tailwind and don't want to learn anything about it. I decided to ckeck how far can I come with Claude free plan; I used its plain web site, not integration or plug-ins. There was a little struggle at the beginning due to changes in Tailwind CSS 4.x, so I had to ask Gemini for little help. Going forward I also used Gemini CLI, GitHub Copilot and Roo Code, but never any paid LLM.

## Key Features

*   **React & Vite Setup**: Fast, modern React app bootstrapped with Vite for instant dev server startup and hot module reload.
*   **Tailwind CSS v4**: Utility-first CSS for rapid, maintainable styling.
*   **Firebase Integration**: Uses Firestore for real-time data persistence and Firebase Hosting for deployment.
*   **React DnD**: Implements robust and accessible drag-and-drop functionality for cards.
*   **Component-Based Architecture**: The UI is broken down into small, reusable components for better maintainability.
*   **Custom Hooks**: Business logic and state management are encapsulated in custom hooks to separate concerns.
*   **ESLint**: Code linting is set up to enforce best practices and code quality.
*   **Lucide Icons**: Uses `lucide-react` for scalable and consistent iconography.

## The Kanban Board

*   **Core UI**: The main interface is a multi-column kanban board.
*   **Drag & Drop**: Cards (tasks) can be seamlessly dragged and dropped between different rows and columns, with state changes persisted to Firestore.
*   **In-Place Editing**: Card and column titles can be edited directly in the UI.
*   **Task Management**: Cards feature a title, completion status, priority flag, tags, and a due date selector.
*   **Dynamic Lanes and Cards**: Users can add and delete lanes and cards. Deleting a lane with cards in it will trigger a confirmation dialog.
*   **Colorful UI**: Each column and card is assigned a unique, muted color for better visual organization, and these colors are persisted.

## Project Structure

*   `src/hooks/useBoard.js`: A custom hook that encapsulates all the board's business logic, state management, and API interactions.
*   `src/components/Board/`: Contains components that make up the main board structure, such as `Board.jsx`, `Lane.jsx`, and `ColumnHeader.jsx`.
*   `src/components/Card/`: Contains all card-related components, including `DraggableCard.jsx`, `CardHeader.jsx`, `CardTitle.jsx`, and `AddCardForm.jsx`.
*   `src/api/board.js`: A dedicated API layer for all Firestore database operations (fetch, save, update).
*   `src/firebase.js`: Handles Firebase configuration and initialization.
*   `docs/initial-setup.md`: Detailed guide to setting up a React + Tailwind + Vite project on a Debian system.
*   `package.json`: Shows all project dependencies.

## Project Setup

For a step-by-step setup guide, see `docs/initial-setup.md`.

## Testing

- E2E: `docs/e2e-testing.md`
