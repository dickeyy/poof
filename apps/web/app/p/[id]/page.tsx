"use client";

import { Container } from "@/components/container";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";

interface PoofData {
    id: string;
    value: string;
}

export default function PoofPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState<PoofData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function fetchPoof() {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/text/${id}`);

                if (!res.ok) {
                    if (res.status === 404) {
                        setError("This poof has already been viewed or doesn't exist.");
                    } else {
                        setError("Failed to fetch poof content.");
                    }
                    return;
                }

                const poofData = await res.json();
                setData(poofData);
            } catch (err) {
                console.error("Failed to fetch poof:", err);
                setError("Failed to fetch poof content.");
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchPoof();
        }
    }, [id]);

    const copyToClipboard = async () => {
        if (!data?.value) return;

        try {
            await navigator.clipboard.writeText(data.value);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    if (loading) {
        return (
            <Container>
                <Navbar />
                <div className="mt-32 flex min-h-[50vh] items-center justify-center">
                    <div className="text-center">
                        <p className="animate-spin text-5xl">*</p>
                        <p className="text-muted-foreground mt-4">Loading poof...</p>
                    </div>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Navbar />
                <div className="mt-32 flex min-h-[50vh] flex-col items-center justify-center">
                    <div className="max-w-md text-center">
                        <p className="text-muted-foreground mt-2">{error}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button asChild className="mt-6" variant="outline">
                            <Link href="/new">
                                <PlusIcon className="h-4 w-4" />
                                Create a new poof
                            </Link>
                        </Button>
                        <Button asChild className="mt-6" variant="outline">
                            <Link href="/">Go Home</Link>
                        </Button>
                    </div>
                </div>
            </Container>
        );
    }

    if (!data) {
        return null;
    }

    const lines = data.value.split("\n");
    const lineNumbers = Array.from({ length: Math.max(lines.length, 1) }, (_, i) => i + 1);

    return (
        <Container>
            <Navbar />
            <div className="mt-18 mb-12 flex w-full items-center justify-center">
                <div className="w-full max-w-4xl">
                    <div className="mt-6 text-center">
                        <p className="text-muted-foreground mb-4 text-sm">
                            This data has been permanently deleted and cannot be viewed again. After
                            leaving this page, you will never be able to access it again.
                        </p>
                    </div>
                    <div className="relative">
                        <div className="border-muted-foreground/20 bg-muted/30 overflow-x-auto border border-dashed p-0">
                            <div className="flex min-w-max">
                                {/* Line numbers */}
                                <div className="bg-muted/20 border-muted-foreground/10 shrink-0 border-r px-1 py-2">
                                    <div className="text-muted-foreground font-mono text-xs leading-relaxed select-none">
                                        {lineNumbers.map((num) => (
                                            <div
                                                key={num}
                                                className="min-w-8 pr-2 text-right opacity-70"
                                            >
                                                {num}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* Content */}
                                <div className="flex-1 py-2 pr-4 pl-4">
                                    <div className="font-mono text-xs leading-relaxed">
                                        {lines.map((line, index) => (
                                            <div key={index} className="whitespace-pre">
                                                {line || "\u00A0"}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute top-0.5 right-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={copyToClipboard}
                                className="h-6 px-2 text-xs"
                            >
                                {copied ? "Copied!" : "Copy"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
