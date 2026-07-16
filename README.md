# Backend Module: Class Teachers

## What is included
- Repository, service, controller, route, validation, SQL query, and API docs for class teacher assignments.
- Endpoints for class teacher assignments (`/api/classes/teachers`) and class details (`/api/classes/details`).
- PostgreSQL schema support for branches, academic years, sections, subjects, teachers, and class teacher assignments.
- Soft delete and duplicate assignment prevention.

## Run the backend
1. Ensure PostgreSQL is running and the environment variables in your backend config are set.
2. From the backend folder, run:
```bash
npm install
npm run dev
```
3. The API will be available at http://localhost:5000/api.

## Frontend
The React UI is in the frontend folder and expects the backend on http://localhost:5000.
