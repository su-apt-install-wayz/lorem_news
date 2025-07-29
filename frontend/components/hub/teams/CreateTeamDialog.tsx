"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { UserCombobox } from "./UserCombobox";

export function CreateTeamDialog({ children, createTeam }: { children: React.ReactNode; createTeam: (payload: { name: string; leaderId: number; }) => Promise<{ success: boolean; message?: string }>; }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [leader, setLeader] = useState<{ id: number; username: string; email: string; picture: string; } | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = () => {
        if (!name || !leader?.id) return toast.error("Nom ou leader manquant");

        startTransition(async () => {
            const res = await createTeam({ name, leaderId: leader.id });
            if (res.success) {
                toast.success("Équipe créée");
                setOpen(false);
                setName("");
                setLeader(null);
            } else {
                toast.error(res.message ?? "Erreur inconnue");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Créer une équipe</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="team-name">Nom de l'équipe</Label>
                        <Input
                            id="team-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Rédaction Paris"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Leader</Label>
                        <UserCombobox value={leader} onChange={setLeader} placeholder="Rechercher un leader..." />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button disabled={isPending} onClick={handleSubmit}>
                        {isPending ? "Création..." : "Créer"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
