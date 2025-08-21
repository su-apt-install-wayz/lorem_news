"use client";

import { CommentsListLoading } from "@/components/articles/CommentsList";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
import { Spacing } from "@/components/Spacing";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function Error() {
    return (
        <>
            <Header />
            <Spacing size="sm" />
            <main className="w-full max-w-[1500px] mx-auto p-4 max-md:p-2">
                <Section className="relative px-0 space-y-4 max-w-5xl">
                    <Alert variant="destructive" className="mb-5 border-destructive/20 bg-destructive/5 text-destructive">
                        <AlertCircleIcon className="h-4 w-4" />
                        <AlertTitle>Une erreur est survenue.</AlertTitle>
                        <AlertDescription>Impossible de charger l&apos;article.</AlertDescription>
                    </Alert>
                </Section>

                <Section className="px-0 space-y-4 max-w-5xl">
                    <div className="flex justify-between items-center gap-3">
                        <div className="h-6 w-40 bg-muted rounded" />
                        <div className="w-10 h-10 border-4 rounded-full bg-muted" />
                    </div>
                    <div className="h-8 w-10/12 bg-muted rounded" />
                    <div className="h-5 w-7/12 bg-muted rounded" />
                    <div className="w-full h-96 rounded bg-muted" />
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-4 w-full bg-muted rounded" />
                    ))}
                </Section>

                <Spacing size="sm" />

                <Section className="px-0 space-y-4 max-w-5xl">
                    <CommentsListLoading />
                </Section>
            </main>
            <Spacing size="lg" />
            <Footer />
        </>
    );
}
