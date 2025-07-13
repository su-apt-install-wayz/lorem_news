import { HubHeader } from "@/components/hub/hub-header";
import { HubContent } from "@/components/hub/hub-content";
import { createCategory, deleteCategories, getCategories, updateCategory } from "./actions";
import CategoriesList from "@/components/hub/categories/CategoriesList";
import { revalidatePath } from "next/cache";
import { CreateCategoryDialog } from "@/components/hub/categories/CreateCategoryDialog";
import { Button } from "@/components/ui/button";
import { IconCategoryPlus } from "@tabler/icons-react";

export async function handleCreateCategory(payload: { name: string; color: string; }) {
    "use server";
    const res = await createCategory(payload);
    if (res.success) {
        revalidatePath("/hub/categories");
    }
    return res;
}

export async function handleUpdateCategory(id: number, payload: { name: string; color: string; }) {
    "use server";
    const res = await updateCategory(id, payload);
    if (res.success) {
        revalidatePath("/hub/categories");
    }
    return res;
}

export async function handleDeleteCategories(ids: number[]): Promise<number[]> {
    "use server";
    const res = await deleteCategories(ids);
    revalidatePath("/hub/categories");
    return res;
}

export default async function HubCategoriesPage(props: { searchParams: { page?: string; search?: string; } }) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page ?? 1);
    const search = searchParams.search?.toLowerCase() ?? "";

    const categories = await getCategories();
    const itemsPerPage = 10;

    const filtered = search ? categories.filter((c: { name: string; }) => c.name.toLowerCase().includes(search)) : categories;

    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginatedCategories = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <>
            <HubHeader title={"Liste des catégories"} actions={
                <CreateCategoryDialog createCategory={handleCreateCategory}>
                    <Button size="sm">
                        <IconCategoryPlus />
                        <span className="max-md:hidden ml-2">Créer une catégorie</span>
                    </Button>
                </CreateCategoryDialog>
            } />

            <HubContent>
                <CategoriesList categories={paginatedCategories} currentPage={page} totalPages={totalPages} updateCategory={handleUpdateCategory} deleteSelectedCategories={handleDeleteCategories} />
            </HubContent>
        </>
    );
}
