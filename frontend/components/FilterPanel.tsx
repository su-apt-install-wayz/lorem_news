"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Filter } from "lucide-react";

const FilterSchema = z.object({
    category: z.string(),
    sortBy: z.string(),
});

interface FilterPanelProps {
    onFilterChange: (filters: { category: string; sortBy: string }) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onFilterChange }) => {
    const form = useForm<z.infer<typeof FilterSchema>>({
        resolver: zodResolver(FilterSchema),
        defaultValues: {
            category: "all",
            sortBy: "recent",
        },
    });

    function onSubmit(data: z.infer<typeof FilterSchema>) {
        onFilterChange(data);
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 cursor-pointer">
                    <Filter />
                    <span>Filtrer</span>
                </Button>
            </SheetTrigger>
            <SheetContent className="z-99">
                <SheetHeader>
                    <SheetTitle>Filtres</SheetTitle>
                    <SheetDescription>Affinez votre recherche en appliquant des filtres.</SheetDescription>
                </SheetHeader>
                <div className="flex flex-col gap-3 px-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-4 mt-4">
                            {/* Catégorie */}
                            <FormField
                                control={form.control}
                                name="category"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-2">
                                        <FormLabel className="ml-1">Catégorie</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full h-10">
                                                    <SelectValue placeholder="Sélectionner" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="all">Toutes</SelectItem>
                                                    <SelectItem value="tech">Technologie</SelectItem>
                                                    <SelectItem value="design">Design</SelectItem>
                                                    <SelectItem value="business">Business</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Trier par */}
                            <FormField
                                control={form.control}
                                name="sortBy"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col gap-2">
                                        <FormLabel className="ml-1">Trier par</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="w-full h-10">
                                                    <SelectValue placeholder="Trier par" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="recent">Plus récents</SelectItem>
                                                    <SelectItem value="popular">Populaires</SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Bouton appliquer */}
                            <Button className="cursor-pointer w-full" type="submit">
                                Appliquer les filtres
                            </Button>
                        </form>
                    </Form>
                </div>
            </SheetContent>
        </Sheet>
    );
};
