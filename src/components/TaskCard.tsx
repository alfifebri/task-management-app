"use client";

import React from "react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
    task: Task;
    onDelete: (id: string) => void;
    onClick: (task: Task) => void;
}

export const TaskCard = React.memo(function TaskCard({ task, onDelete, onClick }: TaskCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: task.id, data: { type: "Task", task } });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-30 bg-slate-800 p-4 rounded-lg border-2 border-slate-600 h-[100px]"
            />
        );
    }

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onClick(task)}
            layoutId={task.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            className="bg-slate-800 p-4 rounded-lg border border-slate-700 shadow-sm hover:border-blue-500/50 hover:shadow-md cursor-grab active:cursor-grabbing group relative"
        >
            <div className="flex justify-between items-start">
                <p className="text-sm font-medium text-slate-200 line-clamp-2 pr-6">
                    {task.title}
                </p>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(task.id);
                    }}
                    className="absolute top-2 right-2 p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 size={16} />
                </button>
            </div>
            {task.description && (
                <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                    {task.description}
                </p>
            )}
        </motion.div>
    );
});
