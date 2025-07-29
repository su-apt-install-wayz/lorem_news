"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LoaderCircleIcon, XIcon } from "lucide-react";
import { Team } from "@/components/hub/teams/TeamsList";
import { UserCombobox } from "./UserCombobox";

export function EditTeamDialog({ team, updateTeam, onOptimisticUpdate }: { team: Team; updateTeam: (id: number, payload: { name: string; leaderId: number }) => Promise<{ success: boolean; message?: string }>; onOptimisticUpdate: (team: Team) => void; }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(team.name);
    const [leader, setLeader] = useState(team.leader ?? null);
    const [members, setMembers] = useState(team.members);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = () => {
        if (!name || !leader?.id) return toast.error("Nom ou leader manquant");

        startTransition(async () => {
            onOptimisticUpdate({ ...team, name, leader, members });
            const res = await updateTeam(team.id, { name, leaderId: leader.id });

            if (res.success) {
                toast.success("Équipe mise à jour");
                setOpen(false);
            } else {
                toast.error(res.message ?? "Erreur inconnue");
            }
        });
    };

    const removeMember = (id: number) => {
        setMembers((prev) => prev.filter((m) => m.id !== id));
    };

    const addMember = (user: { id: number; username: string; email: string; picture: string; }) => {
        if (!members.find((m) => m.id === user.id)) {
            setMembers((prev) => [...prev, user]);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full cursor-pointer">Modifier</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Modifier l'équipe</DialogTitle>
                    <DialogDescription>
                        Mettez à jour les informations de l'équipe <span className="font-semibold">{team.name}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="edit-name">Nom</Label>
                        <Input
                            id="edit-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isPending}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Leader</Label>
                        <UserCombobox value={leader} onChange={setLeader} placeholder="Rechercher un leader..." />
                    </div>

                    <div className="grid gap-2">
                        <Label>Membres</Label>
                        <UserCombobox value={null} onChange={addMember} placeholder="Ajouter un membre..." />
                        <div className="flex items-center gap-2 flex-wrap">
                            <TooltipProvider>
                                {members.map((member, index) => (
                                    <Tooltip key={member.id}>
                                        <TooltipTrigger asChild>
                                            <div className="relative">
                                                <Avatar className="w-10 h-10 border-2">
                                                    <AvatarImage src={`/assets/profile/${member.picture}`} alt={member.username} />
                                                    <AvatarFallback>{member.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <button onClick={() => removeMember(member.id)} className="absolute -top-1 -right-1 bg-background border border-muted rounded-full p-0.5 text-muted-foreground hover:text-destructive">
                                                    <XIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-sm font-medium">{member.username}</p>
                                            <p className="text-xs text-muted-foreground">{member.email}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                                {members.length === 0 && (
                                    <p className="text-sm text-muted-foreground italic">Aucun membre</p>
                                )}
                            </TooltipProvider>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? (
                            <LoaderCircleIcon className="animate-spin h-6 w-6 text-primary-foreground" />
                        ) : (
                            "Sauvegarder"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
