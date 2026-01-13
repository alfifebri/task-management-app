"use client";

import React, { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Column as ColumnType, Task } from "@/types";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { Button } from "./ui/Button";

interface ColumnProps {
    column: ColumnType;
    tasks: Task[];
    onDeleteTask: (id: string) => void;
    onAddTask: (title: string, status: ColumnType["id"]) => void;
    onTaskClick: (task: Task) => void;
}

export const Column = React.memo(function Column({ column, tasks, onDeleteTask, onAddTask, onTaskClick }: ColumnProps) {
    const { setNodeRef } = useDroppable({
        id: column.id,
        data: { type: "Column", column },
    });
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) {
            setIsAdding(false);
            return;
        };
        onAddTask(title, column.id);
        setTitle("");
        setIsAdding(false);
    };

    return (
        <div className="flex flex-col h-full w-full min-w-[300px] max-w-[350px] bg-slate-900/50 rounded-xl border border-slate-800/50 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-300 flex items-center gap-2">
                    <span className={cn(
                        "w-3 h-3 rounded-full",
                        column.id === 'Todo' && "bg-slate-500",
                        column.id === 'In Progress' && "bg-blue-500",
                        column.id === 'Done' && "bg-emerald-500"
                    )} />
                    {column.title}
                    <span className="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full">
                        {tasks.length}
                    </span>
                </h3>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-slate-800"
                    onClick={() => setIsAdding(true)}
                >
                    <Plus size={16} />
                </Button>
            </div>

            <div ref={setNodeRef} className="flex-1 flex flex-col gap-3 min-h-[150px]">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={onDeleteTask}
                            onClick={onTaskClick}
                        />
                    ))}
                </SortableContext>

                {isAdding && (
                    <form onSubmit={handleSubmit} className="mb-2">
                        <input
                            autoFocus
                            className="w-full bg-slate-800 border border-blue-500 p-3 rounded-lg text-sm text-slate-200 outline-none placeholder:text-slate-500 shadow-md"
                            placeholder="Type a title..."
                            value={title}
                            onBlur={() => !title.trim() && setIsAdding(false)}
                            onChange={(e) => setTitle(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Escape') setIsAdding(false);
                            }}
                        />
                    </form>
                )}

                {!isAdding && tasks.length === 0 && (
                    <div className="flex items-center justify-center h-24 border-2 border-dashed border-slate-800 rounded-lg text-slate-600 text-sm">
                        Drop here
                    </div>
                )}
            </div>
        </div>
    );
});
