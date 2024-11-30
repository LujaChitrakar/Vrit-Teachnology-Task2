# Drag-and-Drop Kanban Board
==========================

A feature-rich Kanban board built with React, TypeScript, and Tailwind CSS, designed to manage tasks effectively with smooth drag-and-drop functionality, customizable columns, and advanced features like search, filtering, and undo/redo.

* * * * *

🚀 Live Demo
------------



* * * * *

✨ Features
----------

### Core Features

1.  **Drag-and-Drop Functionality**: Move tasks seamlessly between columns using `@hello-pangea/dnd`.
2.  **Local Storage Persistence**: Save and load board state automatically.
3.  **Keyboard Accessibility**: Navigate and manage tasks using keyboard shortcuts.
4.  **Search and Filtering**: Search tasks dynamically and filter by columns or metadata.
5.  **Undo/Redo Functionality**: Effortlessly revert or reapply changes.
6.  **Delete Functionality**: Delete list/column or task/cards easily.
7.  **Add Functionality**: Add list/column or task/cards easily.
8.  **Testing**: Testing is performed by using jest and react-testing-library.

### Bonus Features

-   Column creation and deletion.
-   Smooth animations for task movement.

* * * * *

📐 Technology Choices and Rationale
-----------------------------------

### Core Technologies

1.  **React**: Chosen for its component-based architecture, enabling clean separation of concerns.
2.  **TypeScript**: Provides strong typing for better maintainability and fewer runtime errors.
3.  **Tailwind CSS**: Speeds up styling with utility-first CSS classes.
4.  **@hello-pangea/dnd**: Simplifies drag-and-drop functionality with accessibility considerations.

### Why These Choices?

-   Ensures scalability and robustness.
-   Focuses on performance and developer productivity.
-   Aligns with modern best practices.

* * * * *

🛠️ Setup Instructions
----------------------

1.  **Clone the Repository**:

    bash

    Copy code

    `git clone https://github.com/your-username/kanban-board.git
    cd kanban-board`

2.  **Install Dependencies**:

    bash

    Copy code

    `npm install`

3.  **Run the Project**:

    bash

    Copy code

    `npm run dev`

4.  **Run Tests**:

    bash

    Copy code

    `npm test`

5.  **Build for Production**:

    bash

    Copy code

    `npm run build`

6.  **Serve the Build Locally**:

    bash

    Copy code

    `npm run serve`

* * * * *

🧪 Known Limitations and Trade-Offs
-----------------------------------

-   **Undo/Redo Scope**: Limited to task movements and column modifications.
-   **Local Storage**: State persistence is limited to the current browser.
-   **Responsiveness**: Currently not responsive.

* * * * *

🚀 Future Improvements
----------------------

-   Implement real-time updates with a backend.
-   Add user authentication for personalized boards.
-   Allow task dependencies and sub-tasks.
-   Support export/import of board state.
-   Add dark mode for better accessibility.

* * * * *

📊 Evaluation Criteria
----------------------

### 1\. Code Organization and Architecture

-   Components are modular and reusable.
-   Hooks and utilities are segregated for better maintainability.

### 2\. TypeScript/JavaScript Best Practices

-   Strict mode enabled for TypeScript.
-   All variables and functions are properly typed.


### 3\. Test Coverage and Quality

-   Comprehensive tests for drag-and-drop, undo/redo, search, and filtering.

### 5\. Documentation Quality

-   Clear and comprehensive README with setup instructions, feature descriptions, and technology rationale.

* * * * *

🕒 Time Spent
-------------

-   **Planning and Setup**: ~1 hour
-   **Core Features Development**: ~4 hours
-   **Bonus Features and Enhancements**: ~1 hours
-   **Testing and Bug Fixes**: ~1 hours
-   **Documentation and Deployment**: ~1 hours

**Total**: ~8 hours
