import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
import { Spacing } from "@/components/Spacing";
import { ArticlesListLoading } from "@/components/articles/ArticlesList";

export default function Loading() {
    return (
        <>
            <Header />
            <Spacing size="sm" />
            <main className="w-full max-w-[1500px] mx-auto p-4 max-md:p-2">
                <Section className="px-0">
                    <div className="flex justify-between items-center gap-4">
                        <h1 className="text-2xl text-primary font-bold max-sm:text-lg">TOUS LES ARTICLES<span className="max-sm:hidden">{" "}DE LOREM NEWS</span></h1>
                        {/* <FilterPanel onFilterChange={setFilters} /> */}
                    </div>
                    <Spacing size="xs" />
                    <ArticlesListLoading />
                </Section>
            </main >
            <Spacing size="lg" />
            <Footer />
        </>
    );
}
