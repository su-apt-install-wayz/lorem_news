"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import api from "@/lib/api"

const FormSchema = z.object({
    search: z.string().min(1),
})

interface SearchFormProps {
    variant: "desktop" | "mobile"
    className?: string
}

export const SearchForm = ({ variant, className }: SearchFormProps) => {
    const router = useRouter()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { search: "" },
    })

    const [suggestions, setSuggestions] = useState<string[]>([])
    const searchValue = form.watch("search")

    useEffect(() => {
        if (!searchValue || searchValue.length < 2) return setSuggestions([])

        const timeout = setTimeout(() => {
            api.get("/api/articles", { params: { searchQuery: searchValue } })
                .then((res) => setSuggestions(res.data))
                .catch(() => setSuggestions([]))
        }, 300)

        return () => clearTimeout(timeout)
    }, [searchValue])

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        router.push(`/search?q=${encodeURIComponent(data.search)}`)
    }

    const handleSuggestionClick = (value: string) => {
        form.setValue("search", value)
        router.push(`/search?q=${encodeURIComponent(value)}`)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("relative w-full", className)} autoComplete="off">
                <div className={variant === "desktop" ? "flex rounded-sm overflow-hidden" : "flex flex-col gap-4"}>
                    <FormField control={form.control} name="search"
                        render={({ field }) => (
                            <FormItem className={variant === "mobile" ? "flex flex-col gap-2" : "w-full"}>
                                {variant === "mobile" && <FormLabel className="ml-1">Recherche</FormLabel>}
                                <FormControl>
                                    <Input
                                        {...field}
                                        placeholder="Que recherchez-vous ?"
                                        className={cn(
                                            variant === "desktop"
                                                ? "w-full h-10 bg-accent text-accent-foreground rounded-l-sm rounded-r-none shadow-none"
                                                : "h-10"
                                        )}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className={variant === "desktop" ? "cursor-pointer w-10 h-10 rounded-l-none" : "cursor-pointer ml-auto w-max"}>
                        <Search />
                        {variant === "mobile" && <span>Rechercher</span>}
                    </Button>
                </div>

                {suggestions.length > 0 && (
                    <Command className="absolute top-full mt-1 z-50 w-full rounded-md border bg-background shadow-xl">
                        <CommandInput value={searchValue} disabled />
                        <CommandList>
                            <CommandEmpty>Aucun résultat</CommandEmpty>
                            {suggestions.map((s, idx) => (
                                <CommandItem key={idx} onSelect={() => handleSuggestionClick(s)} className="cursor-pointer">
                                    {s}
                                </CommandItem>
                            ))}
                        </CommandList>
                    </Command>
                )}
            </form>
        </Form>
    )
}
