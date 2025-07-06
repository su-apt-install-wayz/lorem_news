import { HubHeader } from "@/components/hub/hub-header";
import { HubContent } from "@/components/hub/hub-content";
import { CategoriesListLoading } from "@/components/hub/categories/CategoriesList";

export default function Loading() {
    return (
        <>
            <HubHeader title={"Liste des catégories"} />

            <HubContent>
                <CategoriesListLoading />
            </HubContent>
        </>
    );
}
