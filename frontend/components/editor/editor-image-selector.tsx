"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageDropzone } from "@/components/image-dropzone";
import { UseFormSetValue } from "react-hook-form";

interface ImageCardProps {
    setValue: UseFormSetValue<any>;
}

export function ImageCard({ setValue }: ImageCardProps) {
    return (
        <Card className="w-full min-w-xs max-w-lg max-lg:max-w-none rounded-md shadow-none">
            <CardHeader>
                <CardTitle>Image de l'article</CardTitle>
                <CardDescription>Sélectionnez une image de présentation.</CardDescription>
            </CardHeader>
            <CardContent>
                <ImageDropzone onImageChange={(base64) => setValue("image", base64)} />
            </CardContent>
        </Card>
    );
}
