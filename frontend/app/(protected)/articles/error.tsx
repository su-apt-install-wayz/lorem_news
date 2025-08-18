"use client";

import { ArticlesListLoading } from "@/components/articles/ArticlesList";
import { Section } from "@/components/Section";
import { Spacing } from "@/components/Spacing";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function Error() {
    return (
        <Section className="px-0">
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-2xl text-primary font-bold max-sm:text-lg">TOUS LES ARTICLES<span className="max-sm:hidden">{" "}DE LOREM NEWS</span></h1>
                {/* <FilterPanel onFilterChange={setFilters} /> */}
            </div>
            <Spacing size="xs" />

            <Alert variant="destructive" className="mb-5 border-destructive/20 bg-destructive/5 text-destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Une erreur est survenue.</AlertTitle>
                <AlertDescription>Impossible de récupérer les articles. Veuillez réessayer plus tard.</AlertDescription>
            </Alert>

            <ArticlesListLoading />
        </Section>
    );
}
