import { HubHeader } from "@/components/hub/hub-header";
import { HubContent } from "@/components/hub/hub-content";
import { deleteCategories, getCategories, updateCategory } from "./actions";
import CategoriesList from "@/components/hub/categories/CategoriesList";
import { revalidatePath } from "next/cache";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { IconCategoryPlus } from "@tabler/icons-react";

export async function handleUpdateCategory(id: number, payload: { name: string; color: string }) {
    "use server";
    const success = await updateCategory(id, payload);
    if (success) {
        revalidatePath("/hub/categories");
    }
    return success;
}

export async function handleDeleteCategories(ids: number[]): Promise<number[]> {
    "use server";
    const res = await deleteCategories(ids);
    revalidatePath("/hub/categories");
    return res;
}

export default async function HubCategoriesPage(props: { searchParams: { page?: string } }) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page ?? 1);

    const categories = await getCategories();
    const itemsPerPage = 10;
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const paginatedCategories = categories.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <>
            <HubHeader title={"Liste des catégories"} actions={
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                                <Button size="sm">
                                    <IconCategoryPlus />
                                    <span className="max-md:hidden ml-2">Créer une catégorie</span>
                                </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Créer une catégorie</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            } />

            <HubContent>
                <CategoriesList categories={paginatedCategories} currentPage={page} totalPages={totalPages} updateCategory={handleUpdateCategory} deleteSelectedCategories={handleDeleteCategories} />
            </HubContent>
        </>
    );
}
