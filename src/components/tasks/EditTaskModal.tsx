"use client";

import { useState, useEffect } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Task } from "@/types";
import { X } from "lucide-react";

interface EditTaskModalProps {
    task: Task;
    onClose: () => void;
}

export function EditTaskModal({ task, onClose }: EditTaskModalProps) {
    const { updateTask } = useTasks();
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description || "");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setTitle(task.title);
        setDescription(task.description || "");
    }, [task]);

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

        // Background update
        updateTask(task.id, { title: taskTitle, description: taskDesc })
            .then(() => {
                toast.success("Task updated");
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to update task");
            });

        // Close immediately
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-6 overflow-hidden"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-slate-100">Edit Task</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8 text-slate-400 hover:text-slate-100"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="edit-title" className="text-sm font-medium text-slate-200">
                            Title <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="edit-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                            autoFocus
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="edit-description" className="text-sm font-medium text-slate-200">
                            Description
                        </label>
                        <textarea
                            id="edit-description"
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
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <motion.div whileTap={{ scale: 0.95 }}>
                            <Button
                                type="submit"
                                disabled={isSubmitting || !title.trim()}
                                isLoading={isSubmitting}
                            >
                                Save Changes
                            </Button>
                        </motion.div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
