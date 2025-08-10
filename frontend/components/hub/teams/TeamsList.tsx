import { SelectionProviderClient } from "@/components/hub/SelectionProviderClient";
import TeamsListActions from "./TeamsListActions";
import PaginationClient from "../PaginationClient";
import { Spacing } from "@/components/Spacing";
import SelectableTeamCard from "./SelectableTeamCard";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TeamCardSkeleton } from "./TeamCard";
import { User } from "./UserCombobox";

export interface TeamMember {
    user: {
        id: number;
        username: string;
        email: string;
        picture: string;
    }
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

export default function TeamsList({ teams, currentPage, totalPages, updateTeam, deleteSelectedTeams, searchLeaders, searchWriters }: { teams: Team[]; currentPage: number; totalPages: number; updateTeam: (id: number, payload: { name: string; leaderId: number; memberIds: number[] }) => Promise<{ success: boolean; message?: string }>; deleteSelectedTeams: (ids: number[]) => Promise<number[]>; searchLeaders: (query: string) => Promise<User[]>; searchWriters: (query: string) => Promise<User[]>; }) {
    return (
        <SelectionProviderClient>
            <TeamsListActions teams={teams} deleteSelectedTeams={deleteSelectedTeams} />

            <ul className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4">
                {teams.map((team) => (
                    <li key={team.id}>
                        <SelectableTeamCard team={team} updateTeam={updateTeam} searchLeaders={searchLeaders} searchWriters={searchWriters} />
                    </li>
                ))}
            </ul>

            <Spacing size="xs" />

            {totalPages > 1 && <PaginationClient currentPage={currentPage} totalPages={totalPages} />}
        </SelectionProviderClient>
    );
}

export function TeamsListLoading(props: { className?: string }) {
    const teamsPerPage = 10;

    return (
        <div className={cn("space-y-2", props.className)}>
            <div className="flex justify-between items-center gap-4 px-1">
                <Skeleton className="w-28 h-5 rounded bg-muted" />

                <div className="flex items-center gap-2">
                    <Skeleton className="w-60 h-8 rounded bg-muted" />
                    <Skeleton className="w-44 h-8 rounded bg-muted" />
                </div>
            </div>

            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4">
                {Array.from({ length: teamsPerPage }).map((_, index) => (
                    <TeamCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}
