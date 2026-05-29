import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { users, records } from './data/mockDb';

const app = express();
app.use(cors());
app.use(express.json());

const delayMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const delay = parseInt(req.query.delay as string) || 0;
  if (delay > 0) {
    setTimeout(() => next(), delay);
  } else {
    next();
  }
};

app.use(delayMiddleware);

app.post('/api/login', (req: Request, res: Response) => {
  const { username, role } = req.body;
  const user = users.find(u => u.username === username && u.role === role);

  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials or role mapping.' });
  }
});

app.get('/api/records/:userId', (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = users.find(u => u.id === userId);

  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.role === 'Admin') {
    res.json(records);
  } else {
    res.json(records.filter(r => r.userId === userId));
  }
});

app.get('/api/admin/users', (req: Request, res: Response) => {
  res.json(users);
});

app.post('/api/admin/users', (req: Request, res: Response) => {
  const { username, role } = req.body;
  const newUser = { id: String(users.length + 1), username, role };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
