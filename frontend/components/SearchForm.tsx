import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from 'lucide-react';
import { toast } from "sonner";

const FormSchema = z.object({
    category: z.string(),
    search: z.string(),
});

interface SearchFormProps {
    variant: "desktop" | "mobile";
    className?: string;
}

export const SearchForm = ({ variant, className }: SearchFormProps) => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            category: "all",
            search: "",
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        toast("Recherche soumise :", {
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={`w-full ${className}`}>
                <div className={variant === "desktop" ? "flex rounded-sm overflow-hidden" : "flex flex-col gap-4"}>
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className={variant === "mobile" ? "flex flex-col gap-2" : ""}>
                                {variant === "mobile" && <FormLabel className="ml-1">Catégorie</FormLabel>}
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className={variant === "desktop" ? "h-10 rounded-r-none" : "w-full h-10"}>
                                            <SelectValue placeholder="All" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="z-99">
                                        <SelectGroup>
                                            <SelectLabel>Catégories</SelectLabel>
                                            <SelectItem className="cursor-pointer" value="all">All</SelectItem>
                                            <SelectItem className="cursor-pointer" value="apple">Apple</SelectItem>
                                            <SelectItem className="cursor-pointer" value="banana">Banana</SelectItem>
                                            <SelectItem className="cursor-pointer" value="blueberry">Blueberry</SelectItem>
                                            <SelectItem className="cursor-pointer" value="grapes">Grapes</SelectItem>
                                            <SelectItem className="cursor-pointer" value="pineapple">Pineapple</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="search"
                        render={({ field }) => (
                            <FormItem className={variant === "mobile" ? "flex flex-col gap-2" : "w-full"}>
                                {variant === "mobile" && <FormLabel className="ml-1">Recherche</FormLabel>}
                                <FormControl>
                                    <Input 
                                        type="text" 
                                        placeholder="Que recherchez-vous ?" 
                                        {...field} 
                                        className={variant === "desktop" ? "w-full h-10 bg-accent text-accent-foreground rounded-none shadow-none" : "h-10"}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button className={variant === "desktop" ? "cursor-pointer w-10 h-10 rounded-l-none" : "cursor-pointer ml-auto w-max"}  type="submit">
                        <Search />
                        {variant === "mobile" && <span>Rechercher</span>}
                    </Button>
                </div>
            </form>
        </Form>
    );
};
