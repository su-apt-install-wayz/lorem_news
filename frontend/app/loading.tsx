// app/loading.tsx — Tailwind v4 + shadcn
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
                    <h1 className="text-2xl text-primary font-bold text-center">
                        LES ACTUALITÉS <span className="max-sm:hidden">DE LOREM NEWS</span>
                    </h1>
                    <Spacing size="xs" />
                    <ArticlesListLoading />
                </Section>
            </main>
            <Spacing size="lg" />
            <Footer />
        </>
    );
}
