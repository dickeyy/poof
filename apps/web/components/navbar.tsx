import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export function Navbar() {
    const linkCn = "hover:opacity-70 transition-all";
    return (
        <nav className="bg-background fixed top-0 left-0 z-50 w-full py-2">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Link
                    href="/"
                    className="text-2xl font-bold transition-all duration-300 hover:animate-spin"
                >
                    *
                </Link>
                <Link href="https://github.com/dickeyy/poof" target="_blank" className={linkCn}>
                    GitHub
                </Link>
                <Link href="https://github.com/sponsors/dickeyy" target="_blank" className={linkCn}>
                    Donate
                </Link>
                <Button variant="outline" className="h-fit py-1" asChild>
                    <Link href="/new" className="flex items-center gap-2">
                        <PlusIcon className="h-4 w-4" />
                        New poof
                    </Link>
                </Button>
            </div>
        </nav>
    );
}
