import { SelectionProviderClient } from "@/components/hub/SelectionProviderClient";
import TeamsListActions from "./TeamsListActions";
import PaginationClient from "../PaginationClient";
import { Spacing } from "@/components/Spacing";
import SelectableTeamCard from "./SelectableTeamCard";

export interface TeamMember {
    id: number;
    username: string;
    email: string;
    picture: string;
}

export interface TeamLeader {
    id: number;
    username: string;
    email: string;
    picture: string;
}

export interface Team {
    id: number;
    name: string;
    leader: TeamLeader;
    members: TeamMember[];
}

export default function TeamsList({ teams, currentPage, totalPages, updateTeam, deleteSelectedTeams }: { teams: Team[]; currentPage: number; totalPages: number; updateTeam: (id: number, payload: { name: string; leaderId: number }) => Promise<{ success: boolean; message?: string }>; deleteSelectedTeams: (ids: number[]) => Promise<number[]>; }) {
    return (
        <SelectionProviderClient>
            <TeamsListActions teams={teams} deleteSelectedTeams={deleteSelectedTeams} />

            <ul className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4">
                {teams.map((team) => (
                    <li key={team.id}>
                        <SelectableTeamCard team={team} updateTeam={updateTeam} />
                    </li>
                ))}
            </ul>

            <Spacing size="xs" />

            {totalPages > 1 && <PaginationClient currentPage={currentPage} totalPages={totalPages} />}
        </SelectionProviderClient>
    );
}
