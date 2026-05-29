import express, { Request, Response } from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const DB_PATH = path.join(__dirname, 'db.json');

// Helper to read DB
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
// Helper to write DB
const writeDB = (data: any) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Middleware for Artificial Delay
const artificialDelay = (req: Request, res: Response, next: () => void) => {
  const delay = parseInt(req.query.delay as string) || 1000; // default 1 second
  setTimeout(next, delay);
};

// 1. Authentication Endpoint
app.post('/api/login', artificialDelay, (req: Request, res: Response) => {
  const { username, password, role } = req.body;
  const db = readDB();
  
  const user = db.users.find((u: any) => u.username === username && u.password === password && u.role === role);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials or role assignment.' });
  }
  
  // Return user info (excluding password)
  const { password: _, ...userWithoutPassword } = user;
  res.json(userWithoutPassword);
});

// 2. Get User Records (General User sees theirs, Admin sees all)
app.get('/api/records', artificialDelay, (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  const role = req.query.role as string;
  const db = readDB();

  if (role === 'Admin') {
    return res.json(db.records);
  } else {
    const userRecords = db.records.filter((r: any) => r.userId === userId);
    return res.json(userRecords);
  }
});

// 3. Admin Only: Get All Users
app.get('/api/users', artificialDelay, (req: Request, res: Response) => {
  const db = readDB();
  res.json(db.users.map(({ password, ...u }: any) => u));
});

// 4. Admin Only: Delete User
app.delete('/api/users/:id', (req: Request, res: Response) => {
  const db = readDB();
  db.users = db.users.filter((u: any) => u.id !== req.params.id);
  writeDB(db);
  res.json({ message: 'User managed/deleted successfully.' });
});

app.listen(3000, () => console.log('Backend running on http://localhost:3000'));
