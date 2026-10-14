# AlgoVision

Interactive DSA Algorithm Visualizer & Line-by-Line Debugger

## Current Demo

- Bubble Sort
- Step-by-step execution
- Code line highlighting
- Variable tracking
- Array visualization
- Previous / Next / Reset controls

## Tech Stack

React
TypeScript
Vite
Tailwind CSS

## Signup backend

Email signup and login use MySQL through the Flask service in `backend/`.
The React app stores the authenticated user locally for protected routes.

1. Create the database with `backend/schema.sql`.
2. Copy `backend/.env.example` to `backend/.env` and set the MySQL credentials.
3. Install backend dependencies with `python -m pip install -r backend/requirements.txt`.
4. Start the API with `python backend/app.py`.
5. Start the frontend with `npm run dev`.

Set `VITE_API_URL` when the API is not running at `http://127.0.0.1:5000`.

## Future

Searching
Sorting
Graphs
Trees
Arrays
...
