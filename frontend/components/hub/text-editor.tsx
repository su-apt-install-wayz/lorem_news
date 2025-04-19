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
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AlignCenterIcon, AlignLeftIcon, BoldIcon, CaseSensitiveIcon, CodeIcon, HighlighterIcon, ItalicIcon, LinkIcon, PaintBucketIcon, StrikethroughIcon, TypeIcon, UnderlineIcon, UnlinkIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";

const TextEditor: React.FC<{ setEditorInstance: (editor: any) => void }> = ({ setEditorInstance }) => {
    const [selectedColor, setSelectedColor] = useState("#1f2937");
    const [selectedFont, setSelectedFont] = useState("");

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
        "#5145CD", "#B43403", "#FCE96A", "#1E429F", "#768FFD", "#BCF0DA",
        "#EBF5FF", "#16BDCA", "#E74694", "#83B0ED", "#03543F", "#111928",
        "#4B5563", "#6B7280", "#D1D5DB", "#F3F4F6", "#F9FAFB"
    ];

    const fonts = [
        { name: "Default", value: "" },
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
        content: "",
        editorProps: {
            attributes: {
                class: "format format-sm sm:format-base lg:format-lg format-indigo max-w-none text-foreground min-h-[200px] focus-visible:outline-none [&_ul]:list-disc [&_ol]:list-decimal [&_ul,&_ol]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4",
            },
        }
    });

    useEffect(() => {
        if (editor) {
            setEditorInstance(editor);
        }
    }, [editor]);

    const addLink = () => {
        const url = prompt("Enter the URL") || "";
        if (editor) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    const removeLink = () => {
        if (editor) editor.chain().focus().unsetLink().run();
    };

    const setFontSize = (size: string) => {
        if (editor) {
            editor.chain().focus().setMark("textStyle", { fontSize: size }).run();
        }
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
                editor.chain().focus().toggleHeading({ level: parseInt(format) as any }).run();
            }
        }
    };

    const addImage = () => {
        const url = prompt("Enter image URL") || "";
        if (editor) editor.chain().focus().setImage({ src: url }).run();
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
                            <ToggleGroupItem
                                value="bold"
                                aria-label="Toggle bold"
                                onClick={() => editor.chain().focus().toggleBold().run()}
                                disabled={!editor.can().chain().focus().toggleBold().run()}
                                className={editor.isActive("bold") ? "bg-muted" : ""}
                            >
                                <BoldIcon />
                            </ToggleGroupItem>

                            <ToggleGroupItem
                                value="italic"
                                aria-label="Toggle italic"
                                onClick={() => editor.chain().focus().toggleItalic().run()}
                                disabled={!editor.can().chain().focus().toggleItalic().run()}
                                className={editor.isActive("italic") ? "bg-muted" : ""}
                            >
                                <ItalicIcon />
                            </ToggleGroupItem>

                            <ToggleGroupItem
                                value="underline"
                                aria-label="Toggle underline"
                                onClick={() => editor.chain().focus().toggleUnderline().run()}
                                disabled={!editor.can().chain().focus().toggleUnderline().run()}
                                className={editor.isActive("underline") ? "bg-muted" : ""}
                            >
                                <UnderlineIcon />
                            </ToggleGroupItem>

                            <ToggleGroupItem
                                value="strike"
                                aria-label="Toggle strikethrough"
                                onClick={() => editor.chain().focus().toggleStrike().run()}
                                disabled={!editor.can().chain().focus().toggleStrike().run()}
                                className={editor.isActive("strike") ? "bg-muted" : ""}
                            >
                                <StrikethroughIcon />
                            </ToggleGroupItem>

                            <ToggleGroupItem
                                value="highlight"
                                aria-label="Toggle highlight"
                                onClick={() => editor.chain().focus().toggleHighlight().run()}
                                disabled={!editor.can().chain().focus().toggleHighlight().run()}
                                className={editor.isActive("highlight") ? "bg-muted" : ""}
                            >
                                <HighlighterIcon />
                            </ToggleGroupItem>

                            <ToggleGroupItem
                                value="code"
                                aria-label="Toggle code"
                                onClick={() => editor.chain().focus().toggleCode().run()}
                                disabled={!editor.can().chain().focus().toggleCode().run()}
                                className={editor.isActive("code") ? "bg-muted" : ""}
                            >
                                <CodeIcon />
                            </ToggleGroupItem>

                            <ToggleGroupItem
                                value="link"
                                aria-label="Add link"
                                onClick={addLink}
                            >
                                <LinkIcon />
                            </ToggleGroupItem>

                            <ToggleGroupItem
                                value="unlink"
                                aria-label="Remove link"
                                onClick={removeLink}
                            >
                                <UnlinkIcon />
                            </ToggleGroupItem>
                        </ToggleGroup>

                        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

                        <ToggleGroup
                            type="multiple"
                            className="flex flex-wrap"
                            value={getActiveToggles()}
                            onValueChange={handleToggleChange}
                        >
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <ToggleGroupItem value="font-size" aria-label="Font size">
                                        <CaseSensitiveIcon />
                                    </ToggleGroupItem>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-48">
                                    {[
                                        { size: "16px", label: "16px (Default)", class: "text-base" },
                                        { size: "12px", label: "12px (Tiny)", class: "text-xs" },
                                        { size: "14px", label: "14px (Small)", class: "text-sm" },
                                        { size: "18px", label: "18px (Lead)", class: "text-lg" },
                                        { size: "24px", label: "24px (Large)", class: "text-2xl" },
                                        { size: "36px", label: "36px (Huge)", class: "text-4xl" },
                                    ].map((item) => (
                                        <DropdownMenuItem
                                            key={item.size}
                                            className={item.class}
                                            onSelect={() => setFontSize(item.size)}
                                        >
                                            {item.label}
                                        </DropdownMenuItem>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <ToggleGroupItem value="font-size" aria-label="Font size">
                                        <PaintBucketIcon />
                                    </ToggleGroupItem>
                                </DropdownMenuTrigger>
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
                                    <DropdownMenuItem onSelect={() => setTextColor("#1f2937")}>
                                        Par défaut
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <ToggleGroupItem value="font-size" aria-label="Font size">
                                        <TypeIcon />
                                    </ToggleGroupItem>
                                </DropdownMenuTrigger>
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
                        </ToggleGroup>

                        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

                        <ToggleGroup
                            type="multiple"
                            className="flex flex-wrap"
                            value={getActiveToggles()}
                            onValueChange={handleToggleChange}
                        >
                            <ToggleGroupItem
                                value="left"
                                aria-label="Align left"
                                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                                disabled={!editor.can().chain().focus().setTextAlign("left").run()}
                                className={editor.isActive("left") ? "bg-muted" : ""}
                            >
                                <AlignLeftIcon />
                            </ToggleGroupItem>

                            <ToggleGroupItem
                                value="center"
                                aria-label="Align center"
                                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                                disabled={!editor.can().chain().focus().setTextAlign("center").run()}
                                className={editor.isActive("center") ? "bg-muted" : ""}
                            >
                                <AlignCenterIcon />
                            </ToggleGroupItem>

                            <ToggleGroupItem
                                value="right"
                                aria-label="Align right"
                                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                                disabled={!editor.can().chain().focus().setTextAlign("right").run()}
                                className={editor.isActive("right") ? "bg-muted" : ""}
                            >
                                <AlignLeftIcon />
                            </ToggleGroupItem>
                        </ToggleGroup>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-2 flex-wrap">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Toggle>Format</Toggle>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40">
                            <DropdownMenuLabel>Text Format</DropdownMenuLabel>
                            <DropdownMenuItem onSelect={() => setFormat("paragraph")}>
                                Paragraph
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {[1, 2, 3, 4, 5, 6].map((level) => (
                                <DropdownMenuItem key={level} onSelect={() => setFormat(level.toString())}>
                                    Heading {level}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />

                    <button onClick={addImage} id="addImageButton" type="button" className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M13 10a1 1 0 0 1 1-1h.01a1 1 0 1 1 0 2H14a1 1 0 0 1-1-1Z" clipRule="evenodd" />
                            <path fillRule="evenodd" d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12c0 .556-.227 1.06-.593 1.422A.999.999 0 0 1 20.5 20H4a2.002 2.002 0 0 1-2-2V6Zm6.892 12 3.833-5.356-3.99-4.322a1 1 0 0 0-1.549.097L4 12.879V6h16v9.95l-3.257-3.619a1 1 0 0 0-1.557.088L11.2 18H8.892Z" clipRule="evenodd" />
                        </svg>
                        <span className="sr-only">Add image</span>
                    </button>

                    <button onClick={addVideo} id="addVideoButton" type="button" className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M9 7V2.221a2 2 0 0 0-.5.365L4.586 6.5a2 2 0 0 0-.365.5H9Zm2 0V2h7a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9h5a2 2 0 0 0 2-2Zm-2 4a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H9Zm0 2h2v2H9v-2Zm7.965-.557a1 1 0 0 0-1.692-.72l-1.268 1.218a1 1 0 0 0-.308.721v.733a1 1 0 0 0 .37.776l1.267 1.032a1 1 0 0 0 1.631-.776v-2.984Z" clipRule="evenodd" />
                        </svg>
                        <span className="sr-only">Add video</span>
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        disabled={!editor.can().chain().focus().toggleBulletList().run()}
                        className={`p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 ${editor.isActive('bulletList') ? 'is-active' : ''}`}
                        type="button"
                    >
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5" />
                        </svg>
                        <span className="sr-only">Toggle list</span>
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        disabled={!editor.can().chain().focus().toggleOrderedList().run()}
                        className={`p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 ${editor.isActive('orderedList') ? 'is-active' : ''}`}
                        type="button"
                    >
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6h8m-8 6h8m-8 6h8M4 16a2 2 0 1 1 3.321 1.5L4 20h5M4 5l2-1v6m-2 0h4" />
                        </svg>
                        <span className="sr-only">Toggle ordered list</span>
                    </button>

                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        disabled={!editor.can().chain().focus().toggleBlockquote().run()}
                        className={`p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100 ${editor.isActive('blockquote') ? 'is-active' : ''}`}
                        type="button"
                    >
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" d="M6 6a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3H5a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2H6Zm9 0a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h3a3 3 0 0 1-3 3h-1a1 1 0 1 0 0 2h1a5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3Z" clipRule="evenodd" />
                        </svg>
                        <span className="sr-only">Toggle blockquote</span>
                    </button>

                    <button onClick={() => editor.chain().focus().setHorizontalRule().run()} type="button" className="p-1.5 text-gray-500 rounded-sm cursor-pointer hover:text-gray-900 hover:bg-gray-100">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 12h14" />
                            <path stroke="currentColor" strokeLinecap="round" d="M6 9.5h12m-12 9h12M6 7.5h12m-12 9h12M6 5.5h12m-12 9h12" />
                        </svg>
                        <span className="sr-only">Toggle Horizontal Rule</span>
                    </button>
                </div>
            </div>
            <div className="px-4 py-2 rounded-b-lg">
                <EditorContent editor={editor} className="min-h-[200px] focus:!outline-none" />
            </div>
        </div>

    );
};

export default TextEditor;
