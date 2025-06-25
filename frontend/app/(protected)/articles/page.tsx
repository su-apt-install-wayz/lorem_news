"use client";

import { useEffect, useState } from "react";
import ArticlesList, { Article } from "@/components/articles/ArticlesList";
import { FilterPanel } from "@/components/FilterPanel";
import { Section } from "@/components/Section";
import { Spacing } from "@/components/Spacing";
import api from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { toast } from "sonner";

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
                const response = await api.get("/api/articles");
                setArticles(response.data);
                setLoading(false);
            } catch (err) {
                toast.error("Erreur lors du chargement des articles.");
                setError("Impossible de récupérer les articles. Veuillez réessayer plus tard.");
            }
        };

        fetchArticles();
    }, []);

    return (
        <Section className="px-0">
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-2xl text-primary font-bold max-sm:text-lg">TOUS LES ARTICLES<span className="max-sm:hidden">{" "}DE LOREM NEWS</span></h1>
                <FilterPanel onFilterChange={setFilters} />
            </div>

            <Spacing size="2xs" />

            {error && (
                <Alert variant="destructive" className="mb-5 border-destructive/20 bg-destructive/5 text-destructive">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Une erreur est survenue.</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <ArticlesList className="mt-3" articles={articles} filters={filters} loading={loading} articlesPerPage={error ? 4 : 12} />
        </Section>
    );
}
