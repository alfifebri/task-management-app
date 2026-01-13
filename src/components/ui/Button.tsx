import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "destructive" | "ghost";
    size?: "default" | "sm" | "icon";
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", isLoading, children, ...props }, ref) => {
        const variants = {
            primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md",
            secondary: "bg-slate-700 text-slate-100 hover:bg-slate-600",
            destructive: "bg-red-500 text-white hover:bg-red-600",
            ghost: "hover:bg-slate-800 text-slate-300 hover:text-white",
        };

        const sizes = {
            default: "px-4 py-2",
            sm: "px-3 py-1 text-xs",
            icon: "h-9 w-9 p-0",
        };

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
