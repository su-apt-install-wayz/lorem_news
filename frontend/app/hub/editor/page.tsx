"use client";

import HubLayout from "@/components/hub/hub-layout";
import TextEditor from "@/components/hub/text-editor"
import { Section } from "@/components/Section";
import { useState } from "react";

export default function ArticleEditor() {
    const [editorInstance, setEditorInstance] = useState<any>(null);

    return (
        <HubLayout title="Création d'un article">
            <Section className="w-full">
                <TextEditor setEditorInstance={setEditorInstance} />
            </Section>
        </HubLayout>
    )
}
