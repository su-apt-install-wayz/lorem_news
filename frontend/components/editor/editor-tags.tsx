import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BadgePlusIcon, TagIcon, XIcon } from "lucide-react";
import { useState } from "react";

interface CardTagInputProps {
    tags: string[];
    onAddTag: (tag: string) => void;
    onRemoveTag: (tag: string) => void;
}

export function CardTagInput({ tags, onAddTag, onRemoveTag }: CardTagInputProps) {
    const [inputValue, setInputValue] = useState("");

    const handleAddTag = () => {
        const newTag = inputValue.trim();
        if (newTag && !tags.includes(newTag)) {
            onAddTag(newTag);
            setInputValue("");
        }
    };

    return (
        <Card className="w-full rounded-md shadow-none">
            <CardHeader>
                <CardTitle>Tags de l&apos;article</CardTitle>
                <CardDescription>Ajoutez des tags à l&apos;article.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                <div className="flex gap-2 items-center">
                    <Input
                        placeholder="Ajouter un tag..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleAddTag();
                            }
                        }}
                    />
                    <Button size="sm" type="button" onClick={handleAddTag} title="Ajouter le tag" aria-label="Ajouter le tag"><BadgePlusIcon /></Button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <Badge key={tag} variant={"outline"} className="flex items-center gap-2 bg-accent border-muted p-2 py-1">
                            <TagIcon />
                            {tag}
                            <Button size={"sm"} variant={"ghost"} onClick={() => onRemoveTag(tag)} title={`Supprimer le tag ${tag}`} className="p-2 h-6 w-6 hover:text-destructive">
                                <XIcon className="w-3 h-3" />
                            </Button>
                        </Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
