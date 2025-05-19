"use client";

import { useState, useRef } from "react";
import { CloudUploadIcon, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ImageDropzoneProps {
    onImageChange: (base64: string | null) => void;
}

export function ImageDropzone({ onImageChange }: ImageDropzoneProps) {
    const [dragActive, setDragActive] = useState(false);
    const [fileName, setFileName] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }

    function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }

    function handleDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            setFileName(file.name);

            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                onImageChange(base64String);
            };
            reader.readAsDataURL(file);
        }
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFileName(file.name);

            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                onImageChange(base64String);
            };
            reader.readAsDataURL(file);
        }
    }

    function handleClick() {
        inputRef.current?.click();
    }

    function handleRemoveImage() {
        setFileName(null);
        onImageChange(null);
    }

    return (
        <>
            <div onClick={handleClick} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
                className={cn(
                    "w-full h-36 border bg-accent border-dashed rounded-md flex items-center justify-center transition-colors cursor-pointer relative",
                    dragActive ? "border-primary bg-primary/10" : "border-muted"
                )}
            >
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <CloudUploadIcon className="h-8 w-8 mb-2" />
                    {fileName ? (
                        <>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button size={"sm"} variant={"ghost"} onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveImage();
                                        }} className="absolute top-3 right-3 text-destructive"><XIcon /></Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Retirer l'image</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <p className="text-sm font-medium truncate max-w-64">{fileName}</p>
                            <p className="text-xs text-muted-foreground">Format : PNG, JPG</p>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-center">Cliquez ou déposez une image</p>
                            <p className="text-xs">Format : PNG, JPG</p>
                        </>
                    )}
                </div>
            </div>

            <input
                type="file"
                accept="image/png, image/jpeg"
                ref={inputRef}
                onChange={handleFileChange}
                className="hidden"
            />
        </>
    );
}
