import { HubHeader } from "@/components/hub/hub-header";
import { HubContent } from "@/components/hub/hub-content";
import { CreateTeamDialog } from "@/components/hub/teams/CreateTeamDialog";
import { Button } from "@/components/ui/button";
import { IconUsersPlus } from "@tabler/icons-react";
import { getTeams, handleCreateTeam, handleDeleteTeams, handleSearchLeaders, handleSearchWriters, handleUpdateTeam } from "../actions";
import TeamsList from "@/components/hub/teams/TeamsList";

type SearchParams = { page?: string; search?: string };
type PageProps = { searchParams: Promise<SearchParams> };

export default async function HubTeamsPage({ searchParams }: PageProps) {
    const sp = await searchParams;
    const page = Number(sp.page ?? 1);
    const search = (sp.search ?? "").toLowerCase();

    const teams = await getTeams();
    const itemsPerPage = 10;

    const filtered = search ? teams.filter((t: { name: string; }) => t.name.toLowerCase().includes(search)) : teams;
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <>
            <HubHeader title={"Liste des équipes"} actions={
                <CreateTeamDialog createTeam={handleCreateTeam} searchLeaders={handleSearchLeaders} searchWriters={handleSearchWriters}>
                    <Button size="sm">
                        <IconUsersPlus />
                        <span className="max-md:hidden ml-2">Créer une équipe</span>
                    </Button>
                </CreateTeamDialog>
            }
            />

            <HubContent>
                <TeamsList teams={paginated} currentPage={page} totalPages={totalPages} updateTeam={handleUpdateTeam} deleteSelectedTeams={handleDeleteTeams} searchLeaders={handleSearchLeaders} searchWriters={handleSearchWriters} />
            </HubContent>
        </>
    );
}
