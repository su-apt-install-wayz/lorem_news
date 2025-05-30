"use client";

import ArticlesList, { Article } from "@/components/ArticlesList";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
import { Spacing } from "@/components/Spacing";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import api from "@/lib/api";
import { AlertCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function Home() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get("/api/articles");
                setArticles(response.data);
                setLoading(false);
            } catch {
                setError("Impossible de récupérer les articles. Veuillez réessayer plus tard.");
            }
        };

        fetchArticles();
    }, []);

    return (
        <>
            <Header />
            <Spacing size="sm" />
            <main className="w-full max-w-[1500px] mx-auto p-4 max-md:p-2">
                <Section className="px-0">
                    <h1 className="text-2xl text-primary font-bold text-center">LES ACTUALITÉS<span className="max-sm:hidden">{" "}DE LOREM NEWS</span></h1>
                    <Spacing size="xs" />

                    {error && (
                        <Alert variant="destructive" className="mb-5 border-destructive/20 bg-destructive/5 text-destructive">
                            <AlertCircleIcon className="h-4 w-4" />
                            <AlertTitle>Une erreur est survenue.</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <ArticlesList className="mt-3" articles={articles} loading={loading} articlesPerPage={error ? 4 : 12} />
                </Section>
            </main>
            <Spacing size="lg" />
            <Footer />
        </>
    );
}
