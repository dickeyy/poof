"use client";

import { Container } from "@/components/container";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { HashIcon, SendIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
    content: z
        .string()
        .min(1, "Content cannot be empty")
        .max(10000, "Content must be less than 10,000 characters")
        .refine((content) => content.trim().length > 0, "Content cannot be only whitespace")
});

type FormData = z.infer<typeof formSchema>;

export default function Page() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [createdPoofId, setCreatedPoofId] = useState("");

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: ""
        }
    });

    async function onSubmit(data: FormData) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/text`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: data.content
                })
            });

            if (!res.ok) {
                form.setError("content", { message: "Failed to create poof" });
                return;
            }

            const resData = await res.json();
            setCreatedPoofId(resData.id);
            setDialogOpen(true);

            form.reset();
        } catch (err) {
            console.error("Failed to create poof: ", err);
            form.setError("content", { message: "Failed to create poof" });
            return;
        }
    }

    return (
        <Container>
            <Navbar />
            <div className="mt-32 flex w-full items-center justify-center">
                <div className="w-full max-w-4xl">
                    <div className="mb-8 flex items-center gap-4">
                        <HashIcon className="h-8 w-8 opacity-20" />
                        <h1 className="text-4xl font-bold">New poof</h1>
                    </div>
                    <div className="flex flex-row items-start justify-between gap-4"></div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="sr-only">Content</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Enter your text here..."
                                                spellCheck={false}
                                                className="border-primary bg-muted/40 h-96 w-full font-mono text-sm shadow-none"
                                                autoComplete="off"
                                                autoCorrect="off"
                                                autoCapitalize="off"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            This content will be encrypted and available only once.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex flex-col items-start justify-center gap-4">
                                <Button
                                    type="submit"
                                    className="flex cursor-pointer items-center gap-2"
                                    disabled={form.formState.isSubmitting}
                                >
                                    <SendIcon className="h-4 w-4" />
                                    {form.formState.isSubmitting ? "Creating..." : "Create poof"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
            <SuccessDialog open={dialogOpen} setOpen={setDialogOpen} poofId={createdPoofId} />
        </Container>
    );
}

function SuccessDialog({
    open,
    setOpen,
    poofId
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    poofId: string;
}) {
    const [copied, setCopied] = useState(false);
    const poofUrl = `${window.location.origin}/p/${poofId}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(poofUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Your poof has been created</DialogTitle>
                    <DialogDescription>Here is your one-time link:</DialogDescription>
                </DialogHeader>
                <div className="mt-4">
                    <div className="bg-muted/50 flex items-center gap-2 rounded-md border p-3">
                        <code className="flex-1 font-mono text-sm break-all">{poofUrl}</code>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={copyToClipboard}
                            className="shrink-0"
                        >
                            {copied ? "Copied!" : "Copy"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
