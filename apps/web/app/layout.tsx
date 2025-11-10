import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "poof.sh",
    description:
        "Share one-time information securely. Create a short-lived text file, send a link, and it disappears forever after someone views it. 100% free, open-source, and self-hostable.",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://poof.sh",
        title: "poof.sh",
        description:
            "Share one-time information securely. Create a short-lived text file, send a link, and it disappears forever after someone views it. 100% free, open-source, and self-hostable.",
        images: [
            {
                url: "https://poof.sh/og-image.png",
                width: 1200,
                height: 630
            }
        ]
    },
    keywords: [
        "poof",
        "poof.sh",
        "one-time",
        "text",
        "file",
        "share",
        "secure",
        "open-source",
        "self-hostable"
    ],
    authors: [{ name: "Kyle Dickey", url: "https://github.com/dickeyy" }]
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="antialiased">{children}</body>
        </html>
    );
}
