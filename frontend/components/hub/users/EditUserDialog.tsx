"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { User } from "./UsersList";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";

const roleMap: Record<string, string> = {
    ROLE_USER: "Utilisateur",
    ROLE_MEMBER: "Rédacteur",
    ROLE_LEADER: "Rédacteur en chef",
    ROLE_ADMIN: "Administrateur",
};

interface EditUserDialogProps {
    user: User;
    updateUser: (id: number, payload: { email: string; username: string; roles: string[] }) => Promise<boolean>;
    onOptimisticUpdate: (updated: User) => void;
}

export function EditUserDialog({ user, updateUser, onOptimisticUpdate }: EditUserDialogProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [email, setEmail] = useState(user.email);
    const [username, setUsername] = useState(user.username);
    const [roles, setRoles] = useState<string[]>(user.roles);

    const toggleRole = (role: string) => {
        if (role === "ROLE_USER") return;
        setRoles((prev) =>
            prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
        );
    };

    const handleSubmit = () => {
        startTransition(async () => {
            const optimisticUser: User = { ...user, email, username, roles };
            onOptimisticUpdate(optimisticUser);

            const success = await updateUser(user.id, { email, username, roles });

            if (success) {
                toast.success("Utilisateur mis à jour.");
                setOpen(false);
            } else {
                toast.error("Erreur lors de la mise à jour.");
            }
        });

    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full cursor-pointer">Modifier</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
                    <DialogDescription>
                        Mettez à jour les informations de <span className="font-semibold">{user.username}</span>.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Nom d&apos;utilisateur</Label>
                        <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="bg-input border-muted"
                            disabled={isPending}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-input border-muted"
                            disabled={isPending}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Rôles</Label>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(roleMap).map(([key, label]) => (
                                <button
                                    key={key}
                                    type="button"
                                    disabled={key === "ROLE_USER" || isPending}
                                    onClick={() => toggleRole(key)}
                                    className={cn(
                                        "text-xs px-2 py-0.5 rounded-full border",
                                        key === "ROLE_USER"
                                            ? "cursor-not-allowed"
                                            : roles.includes(key)
                                                ? "bg-accent border-muted"
                                                : "bg-muted text-muted-foreground border-muted"
                                    )}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Annuler</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit} disabled={isPending}>
                        {isPending ? <LoaderCircleIcon className="animate-spin h-6 w-6 text-primary-foreground" /> : "Sauvegarder"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
