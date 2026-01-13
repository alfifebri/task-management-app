export interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
}

export type TaskStatus = 'Todo' | 'In Progress' | 'Done';

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: TaskStatus;
    userId: string;
    createdAt: number; // Timestamp (millis)
    order: number; // For sorting
}

export interface Column {
    id: TaskStatus;
    title: string;
}
