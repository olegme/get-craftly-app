# Get Craftly App

## Overview

This is a modern React project scaffolded with Vite and styled using Tailwind CSS v4. It features a kanban-style main board for project/task management and is configured for rapid local development and clean, responsive UI design.

## Project Idea

This started as a side project to my other side projects. There is no manual coding involved, I never used React and Tailwind and don't want to learn anything about it. I decided to ckeck how far can I come with Calude free plan; I used its plain web site, not integration or plug-ins. There was a little struggle at the beginning due to changes in Tailwind CSS 4.x, so I had to ask Gemini for little help. 

## Key Features

*   React & Vite Setup: Fast, modern React app bootstrapped with Vite for instant dev server startup and hot module reload.
*   Tailwind CSS v4: Utility-first CSS for rapid, maintainable styling.
*   ESLint: Code linting is set up to enforce best practices and code quality.
*   Lucide Icons: Uses lucide-react for scalable iconography.

## MainBoard Component

*   Kanban Board: The core UI is a multi-column kanban board (`MainBoard.jsx`). Columns represent workflow stages (e.g., Discovery, Design, Development, Testing, Deployment).
*   Drag & Drop: Cards (tasks) can be dragged between columns and rows within the board.
*   Task Details: Each card displays task info, category, priority, and due date and can be marked as completed.
*   Add Task Button: Each row allows adding new tasks (currently logs to console, logic can be extended).
*   Responsive Design: Uses Tailwind CSS classes for a consistent look and feel.

## Project Structure

*   `src/components/MainBoard.jsx`: Core kanban board logic and UI.
*   `docs/initial-setup.md`: Detailed guide to setting up a React + Tailwind + Vite project on a Debian system.
*   `package.json`: Shows dependencies (React, Tailwind CSS, Vite, ESLint, Lucide, etc.).

## Project Setup

For a step-by-step setup guide, see `docs/initial-setup.md`.