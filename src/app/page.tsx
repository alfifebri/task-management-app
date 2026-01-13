"use client";

import { Board } from "@/components/Board";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { auth } from "@/lib/firebase";
import { LogOut, Layout, Plus } from "lucide-react";
import { useState } from "react";
import { AddTaskModal } from "@/components/tasks/AddTaskModal";

export default function Home() {
  const { user, loading } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (loading) return null; // AuthContext handles redirect

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Layout size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">TaskFlow</h1>
        </div>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="hidden sm:flex"
          >
            <Plus size={18} className="mr-2" />
            Add Task
          </Button>

          <div className="text-sm text-slate-400 hidden sm:block">
            {user?.email}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => auth.signOut()}
            className="text-slate-400 hover:text-red-400"
          >
            <LogOut size={18} className="mr-2" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-hidden p-6 relative">
        <div className="h-full max-w-[1600px] mx-auto">
          <Board />
        </div>

        {/* Floating Action Button for Mobile */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="sm:hidden absolute bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
        >
          <Plus size={24} />
        </button>
      </main>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
