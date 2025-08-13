import { HubHeader } from "@/components/hub/hub-header";
import { HubContent } from "@/components/hub/hub-content";
import { getCategories, handleCreateCategory, handleDeleteCategories, handleUpdateCategory } from "./actions";
import CategoriesList from "@/components/hub/categories/CategoriesList";
import { CreateCategoryDialog } from "@/components/hub/categories/CreateCategoryDialog";
import { Button } from "@/components/ui/button";
import { IconCategoryPlus } from "@tabler/icons-react";

type SearchParams = { page?: string; search?: string };
type PageProps = { searchParams: Promise<SearchParams> };

export default async function HubCategoriesPage({ searchParams }: PageProps) {
    const sp = await searchParams;
    const page = Number(sp.page ?? 1);
    const search = (sp.search ?? "").toLowerCase();

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
