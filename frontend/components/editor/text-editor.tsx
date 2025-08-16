"use client";

import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import YouTube from "@tiptap/extension-youtube";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AlignCenterIcon, AlignLeftIcon, BoldIcon, CodeIcon, FileVideo2Icon, HighlighterIcon, ImageIcon, ItalicIcon, LinkIcon, ListIcon, ListOrderedIcon, MessageSquareQuoteIcon, MinusIcon, PaintBucketIcon, StrikethroughIcon, TypeIcon, UnderlineIcon, UnlinkIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const TextEditor: React.FC<{ defaultContent?: string, onContentChange?: (value: string) => void }> = ({ defaultContent = "", onContentChange }) => {
    const [selectedColor, setSelectedColor] = useState("#1f2937");
    const [selectedFont, setSelectedFont] = useState("");
    const [linkUrl, setLinkUrl] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
    const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);

    const getActiveToggles = () => {
        const types = ['bold', 'italic', 'underline', 'strike', 'highlight', 'code'];
        return types.filter(type => editor?.isActive(type));
    };

    const handleToggleChange = (values: string[]) => {
        const actionsMap = {
            bold: () => editor?.chain().focus().toggleBold().run(),
            italic: () => editor?.chain().focus().toggleItalic().run(),
            underline: () => editor?.chain().focus().toggleUnderline().run(),
            strike: () => editor?.chain().focus().toggleStrike().run(),
            highlight: () => editor?.chain().focus().toggleHighlight().run(),
            code: () => editor?.chain().focus().toggleCode().run(),
        };
        const types: (keyof typeof actionsMap)[] = ['bold', 'italic', 'underline', 'strike', 'highlight', 'code'];

        types.forEach((type) => {
            const shouldBeActive = values.includes(type);
            const isCurrentlyActive = editor?.isActive(type);

            if (shouldBeActive !== isCurrentlyActive) {
                actionsMap[type]?.();
            }
        });
    };

    const textColors = [
        "#1A56DB", "#0E9F6E", "#FACA15", "#F05252", "#FF8A4C", "#0694A2",
        "#B4C6FC", "#8DA2FB", "#5145CD", "#771D1D", "#FCD9BD", "#99154B",
        "#7E3AF2", "#CABFFD", "#D61F69", "#F8B4D9", "#F6C196", "#A4CAFE",
        "#B43403", "#FCE96A", "#1E429F", "#768FFD", "#BCF0DA", "#EBF5FF",
        "#16BDCA", "#E74694", "#83B0ED", "#03543F", "#111928", "#4B5563",
        "#6B7280", "#D1D5DB", "#F3F4F6", "#F9FAFB"
    ];

    const fonts = [
        { name: "Défaut", value: "" },
        { name: "Arial", value: "Arial, sans-serif" },
        { name: "Courier New", value: "'Courier New', monospace" },
        { name: "Georgia", value: "Georgia, serif" },
        { name: "Lucida Sans Unicode", value: "'Lucida Sans Unicode', sans-serif" },
        { name: "Tahoma", value: "Tahoma, sans-serif" },
        { name: "Times New Roman", value: "'Times New Roman', serif" },
        { name: "Trebuchet MS", value: "'Trebuchet MS', sans-serif" },
        { name: "Verdana", value: "Verdana, sans-serif" },
    ];

    const editor = useEditor({
        extensions: [
            StarterKit,
            Bold,
            Underline,
            TextStyle,
            FontFamily,
            Color,
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: "https",
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Image,
            YouTube,
            Highlight,
            BulletList,
            OrderedList,
            ListItem,
            Blockquote,
        ],
        content: defaultContent,
        editorProps: {
            attributes: {
                class: "max-w-none text-foreground min-h-[200px] focus-visible:outline-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul,&_ol]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold [&_h4]:mt-3 [&_h4]:mb-2 [&_h5]:text-md [&_h5]:font-medium [&_h5]:mt-3 [&_h5]:mb-2 [&_h6]:text-base [&_h6]:font-medium [&_h6]:mt-2 [&_h6]:mb-2",
            },
        },
        onUpdate({ editor }) {
            const html = editor.getHTML();
            onContentChange?.(html);
        }
    });

    useEffect(() => {
        if (editor && defaultContent) {
            editor.commands.setContent(defaultContent);
        }
    }, [editor, defaultContent]);

    const addLink = () => {
        if (editor && linkUrl) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run();
            setLinkUrl("");
        }
        setIsLinkDialogOpen(false);
    };

    const removeLink = () => {
        if (editor) editor.chain().focus().unsetLink().run();
    };

    const setTextColor = (color: string) => {
        if (editor) editor.chain().focus().setColor(color).run();
        setSelectedColor(color);
    };

    const setFontFamily = (font: string) => {
        if (editor) {
            editor.chain().focus().unsetFontFamily().run();
            if (font) editor.chain().focus().setFontFamily(font).run();
        }
        setSelectedFont(font);
    };

    const setFormat = (format: string) => {
        if (editor) {
            if (format === "paragraph") {
                editor.chain().focus().setParagraph().run();
            } else {
                editor.chain().focus().toggleHeading({ level: parseInt(format, 10) as 1 | 2 | 3 | 4 | 5 | 6 }).run();
            }
        }
    };

    const addImage = () => {
        if (editor && imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run();
            setImageUrl("");
        }
        setIsImageDialogOpen(false);
    };

    const addVideo = () => {
        const url = prompt("Enter video URL") || "";
        if (url && editor) {
            editor.chain().focus().setNode("video", { src: url }).run();
        }
    };

    if (!editor) return null;

    return (
        <div className="w-full border rounded-lg bg-card">
            <div className="px-3 py-2 border-b">
                <div className="flex flex-wrap items-center">
                    <div className="flex items-center space-x-1 rtl:space-x-reverse flex-wrap">
                        <ToggleGroup
                            type="multiple"
                            className="flex flex-wrap"
                            value={getActiveToggles()}
                            onValueChange={handleToggleChange}
                        >
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ToggleGroupItem
                                            value="bold"
                                            aria-label="Toggle bold"
                                            onClick={() => editor.chain().focus().toggleBold().run()}
                                            disabled={!editor.can().chain().focus().toggleBold().run()}
                                            className={editor.isActive("bold") ? "bg-accent text-accent-foreground" : ""}
                                        >
                                            <BoldIcon />
                                        </ToggleGroupItem>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Gras</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ToggleGroupItem
                                            value="italic"
                                            aria-label="Toggle italic"
                                            onClick={() => editor.chain().focus().toggleItalic().run()}
                                            disabled={!editor.can().chain().focus().toggleItalic().run()}
                                            className={editor.isActive("italic") ? "bg-accent text-accent-foreground" : ""}
                                        >
                                            <ItalicIcon />
                                        </ToggleGroupItem>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Italique</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ToggleGroupItem
                                            value="underline"
                                            aria-label="Toggle underline"
                                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                                            disabled={!editor.can().chain().focus().toggleUnderline().run()}
                                            className={editor.isActive("underline") ? "bg-accent text-accent-foreground" : ""}
                                        >
                                            <UnderlineIcon />
                                        </ToggleGroupItem>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Souligner</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ToggleGroupItem
                                            value="strike"
                                            aria-label="Toggle strikethrough"
                                            onClick={() => editor.chain().focus().toggleStrike().run()}
                                            disabled={!editor.can().chain().focus().toggleStrike().run()}
                                            className={editor.isActive("strike") ? "bg-accent text-accent-foreground" : ""}
                                        >
                                            <StrikethroughIcon />
                                        </ToggleGroupItem>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Barrer</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ToggleGroupItem
                                            value="highlight"
                                            aria-label="Toggle highlight"
                                            onClick={() => editor.chain().focus().toggleHighlight().run()}
                                            disabled={!editor.can().chain().focus().toggleHighlight().run()}
                                            className={editor.isActive("highlight") ? "bg-accent text-accent-foreground" : ""}
                                        >
                                            <HighlighterIcon />
                                        </ToggleGroupItem>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Surligner</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ToggleGroupItem
                                            value="code"
                                            aria-label="Toggle code"
                                            onClick={() => editor.chain().focus().toggleCode().run()}
                                            disabled={!editor.can().chain().focus().toggleCode().run()}
                                            className={editor.isActive("code") ? "bg-accent text-accent-foreground" : ""}
                                        >
                                            <CodeIcon />
                                        </ToggleGroupItem>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Code</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <ToggleGroupItem
                                                    value="link"
                                                    aria-label="Add link"
                                                    onClick={() => setIsLinkDialogOpen(true)}
                                                >
                                                    <LinkIcon />
                                                </ToggleGroupItem>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Lien</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>Ajouter un lien</DialogTitle>
                                            <DialogDescription>Ajoutez un lien en entrant l&apos;URL.</DialogDescription>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="link" className="text-muted-foreground ml-1">URL du lien</Label>
                                                <Input id="link" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="Entrez l'url ici" />
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            <Button variant={"destructive"} type="button" onClick={() => setIsLinkDialogOpen(false)}>Annuler</Button>
                                            <Button type="button" onClick={addLink}>Ajouter</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ToggleGroupItem
                                            value="unlink"
                                            aria-label="Remove link"
                                            onClick={removeLink}
                                        >
                                            <UnlinkIcon />
                                        </ToggleGroupItem>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Retirer le lien</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </ToggleGroup>

                        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

                        <ToggleGroup
                            type="multiple"
                            className="flex flex-wrap"
                            value={getActiveToggles()}
                            onValueChange={handleToggleChange}
                        >
                            <TooltipProvider>
                                <Tooltip>
                                    <DropdownMenu>
                                        <TooltipTrigger asChild>
                                            <DropdownMenuTrigger asChild>
                                                <ToggleGroupItem value="font-size" aria-label="Font size">
                                                    <PaintBucketIcon />
                                                </ToggleGroupItem>
                                            </DropdownMenuTrigger>
                                        </TooltipTrigger>
                                        <DropdownMenuContent className="w-56 space-y-2">
                                            <div className="px-3 pt-2 flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={selectedColor}
                                                    onChange={(e) => setTextColor(e.target.value)}
                                                    className="border border-gray-300 rounded-md h-8 cursor-pointer"
                                                />
                                                <span className="text-gray-500 text-sm font-medium">{selectedColor}</span>
                                            </div>
                                            <div className="grid grid-cols-6 gap-1 px-3">
                                                {textColors.map((color) => (
                                                    <button
                                                        key={color}
                                                        type="button"
                                                        className="w-6 h-6 rounded-md"
                                                        style={{ backgroundColor: color }}
                                                        onClick={() => setTextColor(color)}
                                                    >
                                                        <span className="sr-only">Color {color}</span>
                                                    </button>
                                                ))}
                                            </div>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onSelect={() => setTextColor("#030A16")}>
                                                Par défaut
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <TooltipContent>
                                        <p>Couleur du texte</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <DropdownMenu>
                                        <TooltipTrigger asChild>
                                            <DropdownMenuTrigger asChild>
                                                <ToggleGroupItem value="font-size" aria-label="Font size">
                                                    <TypeIcon />
                                                </ToggleGroupItem>
                                            </DropdownMenuTrigger>
                                        </TooltipTrigger>
                                        <DropdownMenuContent className="w-56">
                                            {fonts.map((font) => (
                                                <DropdownMenuItem
                                                    key={font.value}
                                                    onSelect={() => setFontFamily(font.value)}
                                                    className={`w-full ${selectedFont === font.value ? "font-bold" : ""}`}
                                                    style={{ fontFamily: font.value || "inherit" }}
                                                >
                                                    {font.name}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    <TooltipContent>
                                        <p>Police du texte</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </ToggleGroup>

                        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

                        <ToggleGroup
                            type="multiple"
                            className="flex flex-wrap"
                            value={getActiveToggles()}
                            onValueChange={handleToggleChange}
                        >
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ToggleGroupItem
                                            value="left"
                                            aria-label="Align left"
                                            onClick={() => editor.chain().focus().setTextAlign("left").run()}
                                            disabled={!editor.can().chain().focus().setTextAlign("left").run()}
                                            className={editor.isActive("left") ? "bg-accent text-accent-foreground" : ""}
                                        >
                                            <AlignLeftIcon />
                                        </ToggleGroupItem>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Aligner à gauche</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ToggleGroupItem
                                            value="center"
                                            aria-label="Align center"
                                            onClick={() => editor.chain().focus().setTextAlign("center").run()}
                                            disabled={!editor.can().chain().focus().setTextAlign("center").run()}
                                            className={editor.isActive("center") ? "bg-accent text-accent-foreground" : ""}
                                        >
                                            <AlignCenterIcon />
                                        </ToggleGroupItem>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Centrer</p>
                                    </TooltipContent>
                                </Tooltip>

                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <ToggleGroupItem
                                            value="right"
                                            aria-label="Align right"
                                            onClick={() => editor.chain().focus().setTextAlign("right").run()}
                                            disabled={!editor.can().chain().focus().setTextAlign("right").run()}
                                            className={editor.isActive("right") ? "bg-accent text-accent-foreground" : ""}
                                        >
                                            <AlignLeftIcon />
                                        </ToggleGroupItem>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Aligner à droite</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </ToggleGroup>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-2 flex-wrap">
                    <TooltipProvider>
                        <Tooltip>
                            <DropdownMenu>
                                <TooltipTrigger asChild>
                                    <DropdownMenuTrigger asChild>
                                        <Toggle>Format</Toggle>
                                    </DropdownMenuTrigger>
                                </TooltipTrigger>
                                <DropdownMenuContent className="w-40">
                                    <DropdownMenuItem onSelect={() => setFormat("paragraph")}>
                                        Paragraphe
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {[1, 2, 3, 4, 5, 6].map((level) => (
                                        <DropdownMenuItem key={level} onSelect={() => setFormat(level.toString())}>
                                            Heading {level}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <TooltipContent>
                                <p>Format du texte</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

                    <ToggleGroup
                        type="multiple"
                        className="flex flex-wrap"
                        value={getActiveToggles()}
                        onValueChange={handleToggleChange}
                    >
                        <TooltipProvider>
                            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
                                <DialogTrigger asChild>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <ToggleGroupItem
                                                value="image"
                                                aria-label="Add image"
                                                onClick={() => setIsImageDialogOpen(true)}
                                            >
                                                <ImageIcon />
                                            </ToggleGroupItem>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Image</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Ajouter une image</DialogTitle>
                                        <DialogDescription>Ajoutez une image en entrant l&apos;URL.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="image" className="text-muted-foreground ml-1">URL de l&apos;image</Label>
                                            <Input id="image" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Entrez l'url ici" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button variant={"destructive"} type="button" onClick={() => setIsImageDialogOpen(false)}>Annuler</Button>
                                        <Button type="button" onClick={addImage}>Ajouter</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <ToggleGroupItem
                                        value="video"
                                        aria-label="Add video"
                                        onClick={addVideo}
                                    >
                                        <FileVideo2Icon />
                                    </ToggleGroupItem>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Vidéo</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <ToggleGroupItem
                                        value="bullet-list"
                                        aria-label="Toggle bullet list"
                                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                                        disabled={!editor.can().chain().focus().toggleBulletList().run()}
                                        className={editor.isActive("bulletList") ? "bg-accent text-accent-foreground" : ""}
                                    >
                                        <ListIcon />
                                    </ToggleGroupItem>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Liste à puces</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <ToggleGroupItem
                                        value="ordered-list"
                                        aria-label="Toggle ordered list"
                                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                                        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
                                        className={editor.isActive("orderedList") ? "bg-accent text-accent-foreground" : ""}
                                    >
                                        <ListOrderedIcon />
                                    </ToggleGroupItem>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Liste ordonnée</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <ToggleGroupItem
                                        value="blockquote"
                                        aria-label="Toggle blockquote"
                                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                                        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
                                        className={editor.isActive("blockquote") ? "bg-accent text-accent-foreground" : ""}
                                    >
                                        <MessageSquareQuoteIcon />
                                    </ToggleGroupItem>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Citation</p>
                                </TooltipContent>
                            </Tooltip>

                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <ToggleGroupItem
                                        value="horizontal-rule"
                                        aria-label="Toggle Horizontal Rule"
                                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                                    >
                                        <MinusIcon />
                                    </ToggleGroupItem>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Trait vertical</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </ToggleGroup>
                </div>
            </div>
            <div className="px-4 py-2 rounded-b-lg">
                <EditorContent editor={editor} className="min-h-[200px] focus:!outline-none" />
            </div>
        </div>
    );
};

export default TextEditor;
