"use client";

import { DataTable } from "@/app/hub/users/data-table-user"
import { Button } from "@/components/ui/button"
import HubLayout from "@/components/hub/hub-layout"
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { Users } from "@/components/UsersListe";

export default function Page() {
    const [users, setUsers] = useState<Users[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    let content;


    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const response = await api.get("/api/users");
                setUsers(response.data);
            } catch (err) {
                setError("Impossible de récupérer les utilisateurs : " + err);
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
        content = <DataTable data={users} />;
    }

    return (
        <HubLayout title="Mes commandes" actions={<Button size="sm">Nouvelle commande</Button>}>
            {content}
        </HubLayout>
    );
}
