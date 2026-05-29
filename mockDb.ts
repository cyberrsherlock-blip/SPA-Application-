export interface User {
  id: string;
  username: string;
  role: 'General User' | 'Admin';
}

export interface RecordItem {
  id: string;
  userId: string;
  title: string;
  status: string;
  accessLevel: string;
}

export const users: User[] = [
  { id: '1', username: 'john_user', role: 'General User' },
  { id: '2', username: 'admin_boss', role: 'Admin' },
  { id: '3', username: 'alice_user', role: 'General User' }
];

export const records: RecordItem[] = [
  { id: '101', userId: '1', title: "John's Personal Report", status: 'Completed', accessLevel: 'Low' },
  { id: '102', userId: '1', title: "John's Timesheet", status: 'Pending', accessLevel: 'Low' },
  { id: '103', userId: '3', title: "Alice's Financial Summary", status: 'Completed', accessLevel: 'Low' },
  { id: '201', userId: 'all', title: '[ADMIN] Global System Metrics', status: 'Active', accessLevel: 'High' },
  { id: '202', userId: 'all', title: '[ADMIN] Server Logs & Audits', status: 'Critical', accessLevel: 'High' }
];
