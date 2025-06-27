import { Section } from "@/components/Section";
import { Spacing } from "@/components/Spacing";

export default function Loading() {
    return (
        <Section className="px-0">
            <h1 className="text-2xl text-primary font-bold"><span className="max-sm:hidden">GESTION DE{" "}</span>VOS PARAMETRES</h1>
            <p>Gérez vos informations personnelles, apparence et sécurité</p>
            <Spacing size="xs" />

        </Section>
    );
}
