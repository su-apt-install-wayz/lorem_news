import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectableLabelCheckbox } from "@/components/hub/SelectableLabelCheckbox";
import { EditTeamDialog } from "./EditTeamDialog";
import { Team } from "./TeamsList";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import ViewTeamModal from "./ViewTeamModal";

export default function TeamCard({ team, selected, onToggle, updateTeam, onOptimisticUpdate }: { team: Team; selected: boolean; onToggle: (id: number, checked: boolean) => void; updateTeam: (id: number, payload: { name: string; leaderId: number }) => Promise<{ success: boolean; message?: string }>; onOptimisticUpdate: (team: Team) => void; }) {
    return (
        <Card className="p-4">
            <div className="flex justify-between items-center text-muted-foreground">
                <SelectableLabelCheckbox
                    labelUnchecked="Sélectionner"
                    labelChecked="Désélectionner"
                    checked={selected}
                    onChange={(checked) => onToggle(team.id, checked)}
                />

                <ViewTeamModal team={team} />
            </div>

            <CardHeader className="p-0">
                <CardTitle className="text-base">{team.name}</CardTitle>

                {team.leader ? (
                    <div className="flex flex-col p-0 gap-2">
                        <span className="text-xs text-muted-foreground">Rédacteur en chef</span>
                        <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10 rounded-full border-2">
                                <AvatarImage src={`/assets/profile/${team.leader.picture}`} alt={team.leader.username} />
                                <AvatarFallback>{team.leader.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col">
                                <span className="text-sm">{team.leader.username}</span>
                                <span className="text-xs text-muted-foreground">{team.leader.email}</span>
                            </div>
                        </div>

                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground italic">Aucun chef défini</p>
                )}
            </CardHeader>

            <CardContent className="flex flex-col p-0 gap-2">
                <span className="text-xs text-muted-foreground">Membres de l'équipe</span>

                <div className="flex justify-between items-center gap-2">
                    {(team.members?.length ?? 0) > 0 && (
                        <div className="flex items-center -space-x-3">
                            <TooltipProvider>
                                {(() => {
                                    const members = team.members!;
                                    const visibleMembers = members.slice(0, 3);
                                    const remaining = members.length - 3;

                                    return (
                                        <>
                                            {visibleMembers.map((member, index) => (
                                                <Tooltip key={member.id}>
                                                    <TooltipTrigger className="cursor-pointer" asChild>
                                                        <div className="w-9 h-9" style={{ zIndex: index }}>
                                                            <Avatar className="w-full h-full rounded-full border-2">
                                                                <AvatarImage src={`/assets/profile/${member.picture}`} alt={`Avatar de l'utilisateur ${member.username}`} />
                                                                <AvatarFallback>{member.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                            </Avatar>
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="text-sm font-medium">{member.username}</p>
                                                        <p className="text-xs text-muted">{member.email}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            ))}

                                            {remaining > 0 && (
                                                <div className="w-9 h-9 flex items-center justify-center rounded-full border-2 bg-muted text-xs font-medium text-muted-foreground cursor-default" style={{ zIndex: 3 }}>
                                                    +{remaining}
                                                </div>
                                            )}
                                        </>
                                    );
                                })()}
                            </TooltipProvider>
                        </div>
                    )}

                    <p className="text-sm text-muted-foreground py-2">
                        {team.members?.length > 1 ? `${team.members.length} membres` : team.members?.length === 1 ? "1 membre" : "Aucun membre"}
                    </p>
                </div>
            </CardContent>

            <CardFooter className="p-0">
                <EditTeamDialog team={team} updateTeam={updateTeam} onOptimisticUpdate={onOptimisticUpdate} />
            </CardFooter>
        </Card>
    );
}
