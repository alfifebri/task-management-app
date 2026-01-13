"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { TaskForm } from "./TaskForm";

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddTaskModal({ isOpen, onClose }: AddTaskModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
                    >
                        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl shadow-2xl pointer-events-auto overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
                                <h2 className="text-lg font-semibold text-slate-100">Add New Task</h2>
                                <button
                                    onClick={onClose}
                                    className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-4">
                                <TaskForm onSuccess={onClose} onCancel={onClose} />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
