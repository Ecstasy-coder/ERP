# Meeting Scheduler Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create database tables:
   ```bash
   node initDatabase.js
   ```
3. Start server:
   ```bash
   node server.js
   ```

## API Endpoints

- `POST /api/meetings` - create a new meeting
- `GET /api/meetings` - list meetings
- `GET /api/meetings/:id` - get meeting by id
- `PUT /api/meetings/:id` - update a meeting
- `DELETE /api/meetings/:id` - delete a meeting
- `GET /api/branches` - sample branches list
