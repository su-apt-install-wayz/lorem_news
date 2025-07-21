import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectableLabelCheckbox } from "@/components/hub/SelectableLabelCheckbox";
import { EditTeamDialog } from "./EditTeamDialog";
import { Users, User } from "lucide-react";
import { Team } from "./TeamsList";

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
            </div>

            <CardHeader className="p-0">
                <CardTitle className="text-base">{team.name}</CardTitle>
                <p className="text-sm text-muted-foreground">Chef : {team.leader?.username ?? "Non défini"}</p>
            </CardHeader>

            <CardContent className="p-0">
                <p className="text-sm text-muted-foreground">
                    {team.members?.length > 1
                        ? `${team.members.length} membres`
                        : team.members?.length === 1
                            ? "1 membre"
                            : "Aucun membre"}
                </p>
            </CardContent>

            <CardFooter className="p-0">
                <EditTeamDialog team={team} updateTeam={updateTeam} onOptimisticUpdate={onOptimisticUpdate} />
            </CardFooter>
        </Card>
    );
}
