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
import { User } from "./UserCombobox";

export function EditTeamDialog({ team, updateTeam, onOptimisticUpdate, searchLeaders, searchWriters }: { team: Team; updateTeam: (id: number, payload: { name: string; leaderId: number }) => Promise<{ success: boolean; message?: string }>; onOptimisticUpdate: (team: Team) => void; searchLeaders: (query: string) => Promise<User[]>; searchWriters: (query: string) => Promise<User[]>; }) {
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
                        <Label>Rédacteur en chef</Label>
                        <UserCombobox value={leader} onChange={setLeader} placeholder="Rechercher un leader..." fetchUsers={searchLeaders} />
                    </div>

                    <div className="grid gap-2">
                        <Label>Rédacteurs</Label>
                        <UserCombobox value={null} onChange={addMember} placeholder="Ajouter un rédacteur..." fetchUsers={searchWriters} />
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                            <TooltipProvider>
                                {members.map((member, index) => (
                                    <Tooltip key={member.id}>
                                        <TooltipTrigger className="cursor-pointer" asChild>
                                            <div className="relative">
                                                <div className="w-9 h-9">
                                                    <Avatar className="w-full h-full rounded-full border-2 border-muted">
                                                        <AvatarImage src={`/assets/profile/${member.picture}`} alt={member.username} />
                                                        <AvatarFallback>{member.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                </div>
                                                <button onClick={() => removeMember(member.id)} className="absolute -top-1 -right-1 bg-background border border-muted rounded-full p-0.5 text-muted-foreground hover:text-destructive cursor-pointer">
                                                    <XIcon className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p className="text-sm font-medium">{member.username}</p>
                                            <p className="text-xs text-muted">{member.email}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                                {members.length === 0 && (
                                    <p className="text-sm text-muted">Aucun membre</p>
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
