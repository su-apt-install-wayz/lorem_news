import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/Header";
import { Spacing } from "@/components/Spacing";
import { Footer } from "@/components/Footer";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Lorem News • Dose quotidienne d'actualités",
    description: "Lorem News est un site d'actualités qui vous propose un large choix d'articles sur l'actualité.",
    keywords: ["actualités", "news", "lorem news", "articles", "informations", "blog"],
    authors: [{ name: "Lorem News", url: "https://lorem-news.com" }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="fr">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased h-full min-h-screen`}>
                <SessionProviderWrapper>
                    <Header />
                    <Spacing size="sm" />

                    <main className="w-full max-w-[1500px] mx-auto p-4 max-md:p-2">{children}</main>

                    <Spacing size="lg" />
                    <Footer />
                </SessionProviderWrapper>
                <Toaster />
            </body>
        </html>
    );
}
