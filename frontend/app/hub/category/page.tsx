"use client";

import { DataTable } from "@/app/hub/category/data-table-category"
import HubLayout from "@/components/hub/hub-layout"
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Category } from "@/components/Listes_interfaces";

export default function Page() {
    const [category, setCategory] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    let content;


    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const response = await api.get("/api/categories");
                setCategory(response.data);
            } catch (err) {
                console.error(err);
                setError("Impossible de récupérer les categories");
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, []);
    
    if (error) {
        content = <div className="text-red-500 text-center py-4">{error}</div>;
    } else if (loading) {
        content = <div className="flex justify-center items-center py-10">
                    <p>Chargement...</p>
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"/>
                  </div>;
    } else {
        content = <DataTable data={category} />;
    }

    return (
        <HubLayout title="Hub">
            {content}
        </HubLayout>
    );
}
