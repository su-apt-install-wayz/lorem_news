"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageDropzone } from "@/components/image-dropzone";

interface ImageCardProps {
    setImage: (value: string | null) => void;
}

export function ImageCard({ setImage }: ImageCardProps) {
    return (
        <Card className="w-full min-w-xs max-w-lg max-lg:max-w-none rounded-md shadow-none">
            <CardHeader>
                <CardTitle>Image de l&apos;article</CardTitle>
                <CardDescription>Sélectionnez une image de présentation.</CardDescription>
            </CardHeader>
            <CardContent>
                <ImageDropzone onImageChange={(base64) => setImage(base64 ?? "")} />
            </CardContent>
        </Card>
    );
}
