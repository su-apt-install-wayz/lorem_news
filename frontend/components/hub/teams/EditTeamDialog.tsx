"use client";

import { useState, useTransition } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Team } from "./TeamsList";

export function EditTeamDialog({ team, updateTeam, onOptimisticUpdate }: { team: Team; updateTeam: (id: number, payload: { name: string; leaderId: number }) => Promise<{ success: boolean; message?: string }>; onOptimisticUpdate: (team: Team) => void; }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(team.name);
    const [leaderId, setLeaderId] = useState(team.leader?.id ?? 0);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = () => {
        if (!name || !leaderId) return toast.error("Nom ou leader manquant");

        startTransition(async () => {
            onOptimisticUpdate({ ...team, name, leader: { ...team.leader, id: leaderId } });

            const res = await updateTeam(team.id, { name, leaderId });

            if (res.success) {
                toast.success("Équipe mise à jour");
                setOpen(false);
            } else {
                toast.error(res.message ?? "Erreur inconnue");
            }
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full cursor-pointer">Modifier</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Modifier l'équipe</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="space-y-2">
                        <Label htmlFor="edit-name">Nom</Label>
                        <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-leader">ID du leader</Label>
                        <Input
                            id="edit-leader"
                            type="number"
                            value={leaderId}
                            onChange={(e) => setLeaderId(Number(e.target.value))}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? "Mise à jour..." : "Mettre à jour"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
