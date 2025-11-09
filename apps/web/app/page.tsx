import { Container } from "@/components/container";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HashIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
    return (
        <Container>
            <Navbar />
            {/* Hero section */}
            <div className="mt-32 mb-8 flex max-w-2xl flex-col items-start justify-center gap-12">
                <div className="flex flex-col gap-8">
                    <div className="flex items-center gap-4">
                        <HashIcon className="h-8 w-8 opacity-20" />
                        <span className="text-4xl font-bold">*</span>
                        <h1 className="text-5xl font-bold">poof</h1>
                    </div>
                    <p>
                        Share one-time information securely. Create a short-lived text file, send a
                        link, and it disappears forever after someone views it. 100% free,{" "}
                        <Link
                            href="https://github.com/dickeyy/poof"
                            target="_blank"
                            className="underline underline-offset-2 transition-all hover:opacity-70"
                        >
                            open-source
                        </Link>
                        , and self-hostable.
                    </p>
                    <div className="flex w-full items-center gap-4">
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/new" className="flex items-center gap-2">
                                <PlusIcon className="h-4 w-4" />
                                New poof
                            </Link>
                        </Button>
                    </div>
                </div>
                <Separator className="opacity-40" />
                <div className="flex w-full flex-col gap-8">
                    <div className="flex items-center">
                        <HashIcon className="h-6 w-6 opacity-20" />
                        <HashIcon className="h-6 w-6 opacity-20" />
                        <h2 className="ml-4 text-2xl font-bold">why poof?</h2>
                    </div>
                    <div className="grid w-full grid-cols-2 gap-2">
                        <FeatureCard
                            title="Annonymous"
                            description="No account, no ads, no tracking."
                        />
                        <FeatureCard title="Free" description="Unlimited usage for everyone." />
                        <FeatureCard
                            title="Private"
                            description="Content is encrypted and permanently deleted after viewing."
                        />
                        <FeatureCard
                            title="Open-source"
                            description="Self-host your own instance of poof. Control your data."
                        />
                    </div>
                </div>
            </div>
        </Container>
    );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="flex flex-col gap-1 border border-dashed p-4">
            <p>{title}</p>
            <p className="text-sm opacity-70">{description}</p>
        </div>
    );
}
