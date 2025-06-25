import ArticlesList from "@/components/articles/ArticlesList";
import { Section } from "@/components/Section";
import { Spacing } from "@/components/Spacing";

export default function Loading() {
    return (
        <Section className="px-0">
            <h1 className="text-2xl text-primary font-bold text-center">LES ACTUALITÉS<span className="max-sm:hidden">{" "}DE LOREM NEWS</span></h1>
            <Spacing size="xs" />

            <ArticlesList className="mt-3" articles={[]} loading={true} articlesPerPage={12} />
        </Section>
    );
}
