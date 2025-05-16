# Express API with Knex Setup Guide

## Initial Setup
1. Install dependencies:
```bash
npm install express knex mysql2 dotenv cors
```

2. Optional: Install development dependencies:
```bash
npm install --save-dev nodemon
```

3. Create `.env` file:
```
PORT=8080
DB_HOST=127.0.0.1
DB_NAME=your_db_name
DB_USER=root
DB_PASSWORD=your_password
```

## Database Setup
1. Initialize Knex:
```bash
npx knex init
```

2. Create migration:
```bash
npx knex migrate:make create_tables
```

3. Run migrations:
```bash
npx knex migrate:latest
```

4. Create and run seeds:
```bash
npx knex seed:make seed_data
npx knex seed:run
```

## Express Server Setup
1. Create `server.js`:
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## Development
Add these scripts to `package.json`:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "migrate": "knex migrate:latest",
    "seed": "knex seed:run"
  }
}
```

Run the server:
- For production:
```bash
npm start
```
- For development (with auto-reload):
```bash
npm run dev
``` 