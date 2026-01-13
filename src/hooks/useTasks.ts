"use client";

import { useState, useEffect } from "react";
import {
    collection,
    query,
    where,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    orderBy,
    serverTimestamp,
    QuerySnapshot,
    QueryDocumentSnapshot
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { Task, TaskStatus } from "@/types";

export function useTasks() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setTasks([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "tasks"),
            where("userId", "==", user.uid),
            orderBy("order", "asc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot: QuerySnapshot) => {
            const tasksData: Task[] = [];
            querySnapshot.forEach((doc: QueryDocumentSnapshot) => {
                const data = doc.data();
                tasksData.push({
                    id: doc.id,
                    ...data,
                    // Handle Firestore Timestamp or number
                    createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : (data.createdAt || Date.now())
                } as Task);
            });
            setTasks(tasksData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    const createTask = async (title: string, status: TaskStatus, description: string = "") => {
        if (!user) {
            console.error("Cannot create task: User not authenticated");
            return;
        }

        // Calculate new order (last + 1)
        const columnTasks = tasks.filter(t => t.status === status);
        const maxOrder = columnTasks.length > 0 ? Math.max(...columnTasks.map(t => t.order)) : 0;

        await addDoc(collection(db, "tasks"), {
            title,
            description,
            status,
            userId: user.uid,
            createdAt: serverTimestamp(),
            order: maxOrder + 100 // Gap for easier reordering
        });
    };

    const updateTaskStatus = async (taskId: string, newStatus: TaskStatus, newOrder?: number) => {
        const taskRef = doc(db, "tasks", taskId);
        const updates: any = { status: newStatus };
        if (newOrder !== undefined) {
            updates.order = newOrder;
        }
        await updateDoc(taskRef, updates);
    };

    const updateTask = async (taskId: string, updates: { title?: string; description?: string }) => {
        const taskRef = doc(db, "tasks", taskId);
        await updateDoc(taskRef, updates);
    };

    const deleteTask = async (taskId: string) => {
        await deleteDoc(doc(db, "tasks", taskId));
    };

    return { tasks, loading, createTask, updateTaskStatus, updateTask, deleteTask };
}
