# Team Task Manager

A full-stack task management app built with **FastAPI**, **React**, and **MongoDB**. It supports authentication, project management, team collaboration, task assignment, status tracking, and overdue task monitoring. [web:214][web:17]

## Features

- User Authentication (Signup/Login).  
- Project creation and project listing.  
- Team member management for projects.  
- Task creation, assignment, and status updates.  
- Dashboard with total, pending, completed, and overdue task counts.  
- Responsive UI built with Material UI. [web:214][web:190]

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Material UI

### Backend
- FastAPI
- Pydantic
- JWT Authentication
- Motor / MongoDB

### Database
- MongoDB [web:11][web:17][web:213]

## Project Structure

```bash
task-manager/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── schemas.py
│   └── routes/
│       ├── auth.py
│       ├── projects.py
│       └── tasks.py
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   ├── services/
    │   │   ├── api.js
    │   │   └── auth.js
    │   └── components/
    │       ├── LoginForm.jsx
    │       ├── SignupForm.jsx
    │       ├── Dashboard.jsx
    │       ├── CreateProject.jsx
    │       ├── ProjectList.jsx
    │       ├── ProjectDetails.jsx
    │       ├── TaskList.jsx
    │       └── TaskItem.jsx
```

## API Endpoints

### Auth
- `POST /auth/signup`
- `POST /auth/login`

### Projects
- `GET /projects`
- `POST /projects`
- `GET /projects/{project_id}`
- `PATCH /projects/{project_id}`
- `POST /projects/{project_id}/members`

### Tasks
- `GET /tasks?project_id=...`
- `POST /tasks/{project_id}`
- `PATCH /tasks/{task_id}`
- `DELETE /tasks/{task_id}` [web:214][web:186]

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd task-manager
```

### 2. Backend setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```env
MONGO_URI=mongodb://localhost:27017
JWT_SECRET_KEY=your_secret_key
```

Run the backend:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

If needed, create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:8000
```

## Usage

1. Open the frontend in your browser.
2. Sign up a new account.
3. Log in.
4. Create a project.
5. Open the project details page.
6. Add tasks with due dates.
7. Update task status.
8. View dashboard counts for pending, completed, and overdue tasks.

## Notes

- Make sure MongoDB is running locally before testing signup or project creation.
- The backend expects authenticated requests for project and task routes.
- Due dates are used to calculate overdue tasks automatically. [web:214][web:17]

## Future Improvements

- Team member invitation UI
- Drag-and-drop task boards
- Search and filters
- Notifications for overdue tasks
- Role-based permissions [web:217][web:212]

## License

This project is for educational and development use.