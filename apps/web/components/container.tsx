import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
    className?: string;
}

export function Container({ children, className }: ContainerProps) {
    return (
        <div
            className={cn(
                "mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-4 sm:px-6 lg:px-8",
                className
            )}
        >
            {children}
        </div>
    );
}
