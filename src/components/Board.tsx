"use client";

import { useState } from "react";
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent,
    closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Column } from "./Column";
import { TaskCard } from "./TaskCard";
import { useTasks } from "@/hooks/useTasks";
import { Column as ColumnType, Task, TaskStatus } from "@/types";
import { createPortal } from "react-dom";
import { toast } from "sonner";
import { EditTaskModal } from "./tasks/EditTaskModal";
import { AnimatePresence } from "framer-motion";

const defaultColumns: ColumnType[] = [
    { id: "Todo", title: "To Do" },
    { id: "In Progress", title: "In Progress" },
    { id: "Done", title: "Done" },
];

export function Board() {
    const { tasks, loading, createTask, updateTaskStatus, deleteTask } = useTasks();
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDeleteTask = async (id: string) => {
        try {
            await deleteTask(id);
            toast.success("Task deleted");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete task");
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = tasks.find((t) => t.id === active.id);
        if (task) setActiveTask(task);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeTask = tasks.find((t) => t.id === activeId);
        if (!activeTask) return;

        // Dropped over a column directly (empty column)
        if (defaultColumns.some(col => col.id === overId) && activeTask.status !== overId) {
            updateTaskStatus(activeId, overId as TaskStatus);
            return;
        }

        // Dropped over another task
        const overTask = tasks.find((t) => t.id === overId);
        if (overTask && activeTask.status !== overTask.status) {
            // Different column
            updateTaskStatus(activeId, overTask.status);
        } else if (overTask && activeTask.status === overTask.status && activeId !== overId) {
            // Same column reordering (visual only until we implement order persistence)
            // For now, we just let it snap back or handled by real-time update
            // Since we don't persist order changes efficiently in this MVP, we skip logic here
            // But we could implement a basic swap if needed.
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find the containers
        const activeTask = tasks.find(t => t.id === activeId);
        const overTask = tasks.find(t => t.id === overId);

        if (!activeTask) return;

        // If over a column
        if (defaultColumns.some(col => col.id === overId)) {
            if (activeTask.status !== overId) {
                // We could optimistically visualize here
            }
        }
    };

    const handleAddTask = async (title: string, status: TaskStatus) => {
        if (!title.trim()) return;
        await createTask(title, status, "");
    };

    if (loading) {
        return (
            <div className="flex gap-6 h-full min-w-fit pb-4 overflow-x-auto">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex flex-col h-full w-full min-w-[300px] max-w-[350px] bg-slate-900/50 rounded-xl border border-slate-800/50 p-4 animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-slate-700" />
                                <div className="h-6 w-24 bg-slate-700 rounded" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <div className="h-24 bg-slate-800 rounded-lg" />
                            <div className="h-24 bg-slate-800 rounded-lg" />
                            <div className="h-24 bg-slate-800 rounded-lg" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="h-full w-full overflow-x-auto">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            // onDragOver={handleDragOver}
            >
                <div className="flex gap-6 h-full min-w-fit pb-4">
                    {defaultColumns.map((col) => (
                        <Column
                            key={col.id}
                            column={col}
                            tasks={tasks.filter((t) => t.status === col.id)}
                            onDeleteTask={handleDeleteTask}
                            onAddTask={(title) => handleAddTask(title, col.id)}
                            onTaskClick={setEditingTask}
                        />
                    ))}
                </div>

                {typeof document !== 'undefined' && createPortal(
                    <DragOverlay>
                        {activeTask && (
                            <div className="opacity-80 rotate-2">
                                <TaskCard task={activeTask} onDelete={() => { }} onClick={() => { }} />
                            </div>
                        )}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>

            <AnimatePresence>
                {editingTask && (
                    <EditTaskModal
                        task={editingTask}
                        onClose={() => setEditingTask(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
