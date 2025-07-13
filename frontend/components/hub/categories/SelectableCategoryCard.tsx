"use client";

import { useOptimistic } from "react";
import { Category } from "./CategoriesList";
import { CategoryCard } from "./CategoryCard";
import { useSelection } from "../SelectionProviderClient";

export default function SelectableCategoryCard({ category, updateCategory }: { category: Category; updateCategory: (id: number, payload: { name: string; color: string }) => Promise<{ success: boolean; message?: string }>; }) {
    const { selectedIds, toggle } = useSelection();
    const isSelected = selectedIds.includes(category.id);
    const isDisabled = (category.articleCount ?? 0) > 0;

    const [optimisticCategory, setOptimisticCategory] = useOptimistic(category);

    return (
        <CategoryCard
            category={optimisticCategory}
            selected={isSelected}
            disabled={isDisabled}
            onToggle={(id, checked) => {
                if (!isDisabled) toggle(id, checked);
            }}
            updateCategory={updateCategory}
            onOptimisticUpdate={setOptimisticCategory}
        />
    );
}
