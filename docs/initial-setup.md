// README.md
# React and Tailwind CSS Project Setup

This guide will walk you through setting up a new React project with Tailwind CSS v4.x.

## Prerequisites

Ensure you have Node.js and npm (Node Package Manager) installed on your Debian workstation. You can check by running:

```bash
node -v
npm -v
```

If they are not installed, you can install them using `nvm` (Node Version Manager) for easier management, or directly via `apt`:

```bash
sudo apt update
sudo apt install nodejs npm
```

## Step-by-Step Guide

### 1. Create a New React Project

Open your terminal and create a new React project using Vite (recommended for faster setup and development experience):

```bash
npm create vite@latest my-react-app -- --template react
cd my-react-app
npm install
```

You can replace `my-react-app` with your desired project name.

### 2. Install Tailwind CSS v4.x and Vite Plugin

With Tailwind CSS v4, the approach for integrating with Vite has changed. You now install the core `tailwindcss` package and the `@tailwindcss/vite` plugin.

Navigate into your new project directory and install them:

```bash
cd my-react-app
npm install -D tailwindcss @tailwindcss/vite
```

**Note:** In Tailwind CSS v4, `postcss` and `autoprefixer` are often not needed as direct dependencies if you're using `@tailwindcss/vite`, as the plugin handles much of that integration. The `npx tailwindcss init -p` command (which generated `postcss.config.js`) is no longer used.

### 3. Configure Vite for Tailwind CSS v4.x

Open your `vite.config.js` file in your project root and add the `@tailwindcss/vite` plugin to your plugins array.

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // Import the Tailwind CSS Vite plugin

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Add the Tailwind CSS Vite plugin here
  ],
})
```

### 4. Configure Tailwind CSS Content Paths (Optional, for `tailwind.config.js`)

While Tailwind CSS v4 emphasizes CSS-first configuration, you might still need a `tailwind.config.js` file, especially for defining content paths so Tailwind knows which files to scan for classes. If this file wasn't automatically created (which it won't be with v4's install process), you can create it manually in your project root:

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
**Important:** The `content` array is crucial for Tailwind to find and compile your CSS classes. Ensure it correctly points to all files where you use Tailwind classes.

### 5. Add Tailwind Directives to Your CSS

Open your `src/App.css` file (since your `App.jsx` imports `App.css`) and add the Tailwind directives at the very top.

```css
/* src/App.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* You can add your custom global styles below */
body {
  font-family: 'Inter', sans-serif; /* Using Inter font as per instructions */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```
**Note on CSS-First Configuration:** In some advanced v4 setups, you might also see configuration directly within this CSS file using `@config` at-rules, but for a simple project with Vite, the `tailwind.config.js` for content paths and the Vite plugin is the common approach.

### 6. Update Your React Component (`App.jsx`)

Now, update your `src/App.jsx` file with the provided React component that uses Tailwind CSS classes.

```jsx
// src/App.jsx
import React from 'react';
import './App.css'; // Ensure you import your main CSS file, which is App.css in this case

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full border border-gray-100">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-700">
            Hello, React with Tailwind!
          </span>
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center leading-relaxed">
          This is a simple project demonstrating the integration of React and Tailwind CSS.
          Enjoy the clean and responsive design!
        </p>
        <div className="flex justify-center space-x-4">
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          >
            Learn More
          </button>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Get Started
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-gray-500 text-sm">
          <p>&copy; 2025 React & Tailwind Demo. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
```

### 7. Run Your Project

Finally, start your development server:

```bash
npm run dev
```

This will typically open your browser to `http://localhost:5173` (or another port if 5173 is in use), where you can see your React app styled with Tailwind CSS.

### Project Structure Overview

After following these steps, your project directory will generally look like this:

```
my-react-app/
├── node_modules/
├── public/
│   └── vite.svg
├── src/
│   ├── assets/
│   │   └── react.svg
│   ├── App.jsx           // Your main React component with Tailwind classes
│   ├── index.css         // Contains Tailwind directives and global styles (or App.css)
│   └── main.jsx          // Entry point for your React app
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js    // Configures Tailwind to scan your files (might be auto-created or manual)
├── vite.config.js        // Vite configuration, now including Tailwind plugin
└── postcss.config.js     // May or may not be present, depending on other PostCSS needs
