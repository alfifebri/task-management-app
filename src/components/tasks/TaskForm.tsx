"use client";

import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface TaskFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export function TaskForm({ onSuccess, onCancel }: TaskFormProps) {
    const { createTask } = useTasks();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        // Optimistic UI: Close immediately
        setIsSubmitting(true);
        const taskTitle = title.trim();
        const taskDesc = description.trim();

        // Background creation
        createTask(taskTitle, "Todo", taskDesc)
            .then(() => {
                toast.success("Task created successfully");
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to create task");
            });

        // Reset and close immediately
        setTitle("");
        setDescription("");
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium text-slate-200">
                    Title <span className="text-red-400">*</span>
                </label>
                <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="What needs to be done?"
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    autoFocus
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-slate-200">
                    Description
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Add details (optional)"
                    rows={3}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                />
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <motion.div
                    whileTap={{ scale: 0.95 }}
                >
                    <Button
                        type="submit"
                        disabled={isSubmitting || !title.trim()}
                        isLoading={isSubmitting}
                    >
                        Create Task
                    </Button>
                </motion.div>
            </div>
        </form>
    );
}
