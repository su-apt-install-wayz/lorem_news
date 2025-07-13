import React, { } from "react";
import { Skeleton } from "../../ui/skeleton";
import { cn } from "@/lib/utils";
import { CategoryCardSkeleton } from "./CategoryCard";
import { SelectionProviderClient } from "../SelectionProviderClient";
import PaginationClient from "../PaginationClient";
import { Spacing } from "@/components/Spacing";
import SelectableCategoryCard from "./SelectableCategoryCard";
import CategoriesListActions from "./CategoriesListActions";

export interface Category {
    id: number;
    name: string;
    color: string;
    articleCount?: number;
}

export default async function CategoriesList({ categories, currentPage, totalPages, updateCategory, deleteSelectedCategories }: { categories: Category[]; currentPage: number; totalPages: number; updateCategory: (id: number, payload: { name: string; color: string }) => Promise<{ success: boolean; message?: string }>; deleteSelectedCategories: (ids: number[]) => Promise<number[]>; }) {
    return (
        <SelectionProviderClient>
            <CategoriesListActions categories={categories} deleteSelectedCategories={deleteSelectedCategories} />

            <ul className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4">
                {categories.map((category) => (
                    <li key={category.id}>
                        <SelectableCategoryCard category={category} updateCategory={updateCategory} />
                    </li>
                ))}
            </ul>

            <Spacing size="xs" />

            {totalPages > 1 && (<PaginationClient currentPage={currentPage} totalPages={totalPages} />)}
        </SelectionProviderClient>
    );
}

export function CategoriesListLoading(props: { className?: string }) {
    const categoriesPerPage = 10;

    return (
        <div className={cn("space-y-2", props.className)}>
            <div className="flex justify-between items-center gap-4 px-1">
                <Skeleton className="w-28 h-5 rounded bg-muted" />

                <div className="flex items-center gap-2">
                    <Skeleton className="w-60 h-8 rounded bg-muted" />
                    <Skeleton className="w-44 h-8 rounded bg-muted" />
                </div>
            </div>

            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4">
                {Array.from({ length: categoriesPerPage }).map((_, index) => (
                    <CategoryCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}
