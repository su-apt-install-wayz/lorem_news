"use client";

import { Section } from "@/components/Section";
import { Spacing } from "@/components/Spacing";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function Error() {
    return (
        <Section className="px-0">
            <h1 className="text-2xl text-primary font-bold"><span className="max-sm:hidden">GESTION DE{" "}</span>VOS PARAMETRES</h1>
            <p>Gérez vos informations personnelles, apparence et sécurité</p>
            <Spacing size="xs" />

            <Alert variant="destructive" className="mb-5 border-destructive/20 bg-destructive/5 text-destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Une erreur est survenue.</AlertTitle>
                <AlertDescription>Impossible de récupérer vos informations. Veuillez réessayer plus tard.</AlertDescription>
            </Alert>
        </Section>
    );
}
