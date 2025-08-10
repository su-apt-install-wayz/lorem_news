import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Team } from "./TeamsList";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function ViewTeamModal({ team }: { team: Team }) {
    return (
        <Dialog>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button variant={"ghost"} size={"icon"} className="cursor-pointer">
                                <Eye />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Voir tous les membres</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>

            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Membres de l'équipe</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 max-h-[60vh] overflow-y-auto">
                    {team.leader && (
                        <div className="flex flex-col p-0 gap-3">
                            <span className="text-sm text-muted-foreground">Rédacteur en chef</span>
                            <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10 rounded-full border-2">
                                    <AvatarImage src={`/assets/profile/${team.leader.picture}`} alt={team.leader.username} />
                                    <AvatarFallback>{team.leader.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col">
                                    <span className="text-sm font-medium">{team.leader.username}</span>
                                    <span className="text-xs text-muted-foreground">{team.leader.email}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col p-0 gap-3">
                        <span className="text-sm text-muted-foreground">Rédacteurs de l'équipe</span>
                        <div className="flex flex-col gap-3">
                            {(team.members?.length ?? 0) > 0 ? (
                                team.members.map((member) => (
                                    <div key={member.user?.id} className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10 border-2">
                                            <AvatarImage src={`/assets/profile/${member.user?.picture}`} alt={member.user?.username} />
                                            <AvatarFallback>{member.user?.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>

                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">{member.user?.username}</span>
                                            <span className="text-xs text-muted-foreground">{member.user?.email}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">Aucun membre dans cette équipe.</p>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button>OK</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
