"use server";

import { Section } from "@/components/Section";
import { Spacing } from "@/components/Spacing";
import ArticlesList from "@/components/articles/ArticlesList";
import { getArticles } from "../actions";

type SearchParams = { page?: string };
type PageProps = { searchParams: Promise<SearchParams> };

export default async function HomePage({ searchParams }: PageProps) {
    const sp = await searchParams;
    const page = Math.max(1, Number(sp.page ?? 1));
    const itemsPerPage = 12;

    const all = await getArticles();
    const sorted = [...all].sort(
        (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    );

    const totalPages = Math.max(1, Math.ceil(sorted.length / itemsPerPage));
    const start = (page - 1) * itemsPerPage;
    const paginated = sorted.slice(start, start + itemsPerPage);

    return (
        <Section className="px-0">
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-2xl text-primary font-bold max-sm:text-lg">TOUS LES ARTICLES<span className="max-sm:hidden">{" "}DE LOREM NEWS</span></h1>
                {/* <FilterPanel onFilterChange={setFilters} /> */}
            </div>
            <Spacing size="xs" />
            <ArticlesList articles={paginated} currentPage={page} totalPages={totalPages} className="mt-3" />
        </Section>
    );
}
