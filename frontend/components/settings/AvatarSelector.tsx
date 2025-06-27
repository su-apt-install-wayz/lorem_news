"use client"

import { useState, useTransition } from "react"
import { Pencil, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { avatarList } from "@/app/(protected)/settings/avatars"
import { toast } from "sonner"
import { updateAvatar } from "@/app/(protected)/settings/updateAvatar"

interface AvatarSelectorProps {
    selected: string
    userId: number
}

export function AvatarSelector({ selected, userId }: AvatarSelectorProps) {
    const [isPending, startTransition] = useTransition()
    const [current, setCurrent] = useState(selected)

    const handleSave = () => {
        if (current === selected) return

        startTransition(async () => {
            const res = await updateAvatar(userId, current)

            if (res.success) {
                toast.success("Avatar mis à jour");
            } else {
                toast.error("Impossible de changer l'avatar");
                setCurrent(selected);
            }
        })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative w-fit cursor-pointer group">
                    <Avatar className="relative w-22 h-22 cursor-pointer rounded-full border-4 focus-visible:ring-0 focus-visible:border-border">
                        <AvatarImage src={`/assets/profile/${selected}`} />
                    </Avatar>
                    <div className="absolute bottom-0 right-1 bg-primary p-2 rounded-full shadow group-hover:bg-secondary transition">
                        <Pencil className="w-4 h-4 text-primary-foreground" />
                    </div>
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Choisir un avatar</DialogTitle>
                </DialogHeader>

                <div className="mt-4 flex flex-wrap gap-4">
                    {avatarList.map((avatar, index) => (
                        <Button key={index} className={cn("relative cursor-pointer rounded-full w-22 h-22 border-4 focus-visible:ring-0 focus-visible:border-border", current === avatar && "ring-2 ring-primary")}
                            variant={"link"}
                            size="icon"
                            onClick={() => setCurrent(avatar)}
                        >
                            <Avatar className="w-20 h-20">
                                <AvatarImage src={`/assets/profile/${avatar}`} />
                            </Avatar>

                            {current === avatar && (
                                <div className="absolute -bottom-1 right-0 bg-primary text-primary-foreground rounded-full p-1 shadow">
                                    <Check className="w-5 h-5" />
                                </div>
                            )}
                        </Button>
                    ))}
                </div>

                <DialogFooter className="mt-4 gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Fermer</Button>
                    </DialogClose>
                    <Button type="button" disabled={isPending || current === selected} onClick={handleSave}>Mettre à jour</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
