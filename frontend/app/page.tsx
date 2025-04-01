"use client";

import ArticlesList, { Article } from "@/components/ArticlesList";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
import { Spacing } from "@/components/Spacing";
import { axiosWithAuth, axiosWithoutAuth } from "@/lib/api";
import Image from "next/image";
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
                const api = await axiosWithAuth();
                const response = await api.get("/articles");
                setArticles(response.data);
            } catch (err) {
                setError("Impossible de récupérer les articles. Veuillez réessayer plus tard.");
            } finally {
                setLoading(false);
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
                    {error ? (
                        <div className="flex flex-col items-center text-center py-10 gap-5">
                            <p className="text-destructive font-semibold">{error}</p>
                            <Image src="/assets/laptop-server-error-dark.png" alt="Erreur" width={300} height={200} />
                        </div>
                    ) : (
                        <ArticlesList className="mt-3" articles={articles} loading={loading} />
                    )}
                </Section>
            </main>
            <Spacing size="lg" />
            <Footer />
        </>
    );
}
