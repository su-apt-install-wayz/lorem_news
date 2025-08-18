import { Section } from "@/components/Section";
import { Spacing } from "@/components/Spacing";
import { ArticlesListLoading } from "@/components/articles/ArticlesList";

export default function Loading() {
    return (
        <Section className="px-0">
            <div className="flex justify-between items-center gap-4">
                <h1 className="text-2xl text-primary font-bold max-sm:text-lg">TOUS LES ARTICLES<span className="max-sm:hidden">{" "}DE LOREM NEWS</span></h1>
                {/* <FilterPanel onFilterChange={setFilters} /> */}
            </div>
            <Spacing size="xs" />
            <ArticlesListLoading />
        </Section>
    );
}
