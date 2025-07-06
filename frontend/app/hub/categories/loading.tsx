import { HubHeader } from "@/components/hub/hub-header";
import { HubContent } from "@/components/hub/hub-content";
import { CategoriesListLoading } from "@/components/hub/categories/CategoriesList";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
    return (
        <>
            <HubHeader title={"Liste des catégories"} actions={<Skeleton className="w-40 h-8 rounded bg-muted" />} />

            <HubContent>
                <CategoriesListLoading />
            </HubContent>
        </>
    );
}
