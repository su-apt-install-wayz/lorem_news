import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Section } from "@/components/Section";
import { Spacing } from "@/components/Spacing";

export default function NotFound() {
    return (
        <>
            <Header />
            <Spacing size="sm" />
            <main className="w-full max-w-[1500px] mx-auto p-4 max-md:p-2">
                <Section className="relative px-0 space-y-4 max-w-5xl">
                    <h1 className="text-2xl font-bold text-center">Article introuvable</h1>
                    <p className="text-muted-foreground text-center">Le contenu demandé n&apos;existe pas ou a été supprimé.</p>
                </Section>
            </main>
            <Spacing size="lg" />
            <Footer />
        </>
    );
}
