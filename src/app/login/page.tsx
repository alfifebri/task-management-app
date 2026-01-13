"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            router.push("/");
        } catch (err: any) {
            setError(err.message.replace("Firebase: ", ""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md space-y-8 rounded-xl bg-slate-900 p-8 shadow-2xl border border-slate-800"
            >
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        {isLogin ? "Welcome back" : "Create account"}
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        {isLogin ? "Enter your credentials to access your tasks" : "Sign up to start organizing your life"}
                    </p>
                </div>

                <form onSubmit={handleAuth} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <Input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-500 text-center bg-red-500/10 p-2 rounded">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full" isLoading={loading}>
                        {isLogin ? "Sign in" : "Sign up"}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-slate-400">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                    </span>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-medium text-blue-500 hover:text-blue-400 transition-colors"
                    >
                        {isLogin ? "Sign up" : "Sign in"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
