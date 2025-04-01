"use client";

import { useEffect, useState } from "react";
import ArticlesList, { Article } from "@/components/ArticlesList";
import { FilterPanel } from "@/components/FilterPanel";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
import { Spacing } from "@/components/Spacing";
import Image from "next/image";
import { axiosWithoutAuth } from "@/lib/api";

export default function ArticlesPage() {
    const [filters, setFilters] = useState({ category: "all", sortBy: "recent" });
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            setError(null);
            try {
                const api = await axiosWithoutAuth();
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
            <main className="w-full max-w-[1500px] mx-auto p-4 max-md:p-2">
                <Spacing size="sm" />
                <Section className="px-0">
                    <div className="flex justify-between items-center gap-4">
                        <h1 className="text-2xl text-primary font-bold max-sm:text-lg">
                            TOUS LES ARTICLES<span className="max-sm:hidden"> DE LOREM NEWS</span>
                        </h1>
                        <FilterPanel onFilterChange={setFilters} />
                    </div>

                    {error ? (
                        <div className="flex flex-col items-center text-center py-10 gap-5">
                            <p className="text-destructive font-semibold">{error}</p>
                            <Image src="/assets/laptop-server-error-dark.png" alt="Erreur" width={300} height={200} />
                        </div>
                    ) : (
                        <ArticlesList className="mt-3" articles={articles} filters={filters} loading={loading} />
                    )}
                </Section>
                <Spacing size="lg" />
            </main>
            <Footer />
        </>
    );
}
