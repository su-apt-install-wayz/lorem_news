import { HubHeader } from "@/components/hub/hub-header";
import { HubContent } from "@/components/hub/hub-content";
import { revalidatePath } from "next/cache";
import { CreateTeamDialog } from "@/components/hub/teams/CreateTeamDialog";
import { Button } from "@/components/ui/button";
import { IconUsersPlus } from "@tabler/icons-react";
import { getTeams, createTeam, deleteTeams, updateTeam, searchLeaders, searchWriters } from "../actions";
import TeamsList from "@/components/hub/teams/TeamsList";

export async function handleCreateTeam(payload: { name: string; leaderId: number }) {
    "use server";
    const res = await createTeam(payload);
    if (res.success) revalidatePath("/hub/teams");
    return res;
}

export async function handleUpdateTeam(id: number, payload: { name: string; leaderId: number }) {
    "use server";
    const res = await updateTeam(id, payload);
    if (res.success) revalidatePath("/hub/teams");
    return res;
}

export async function handleDeleteTeams(ids: number[]): Promise<number[]> {
    "use server";
    const res = await deleteTeams(ids);
    revalidatePath("/hub/teams");
    return res;
}

export async function handleSearchLeaders(query: string) {
    "use server";
    const res = await searchLeaders(query);
    return res;
}

export async function handleSearchWriters(query: string) {
    "use server";
    const res = await searchWriters(query);
    return res;
}

export default async function HubTeamsPage(props: { searchParams: { page?: string; search?: string } }) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page ?? 1);
    const search = searchParams.search?.toLowerCase() ?? "";

    const teams = await getTeams();
    const itemsPerPage = 10;

    const filtered = search ? teams.filter((t: { name: string; }) => t.name.toLowerCase().includes(search)) : teams;
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <>
            <HubHeader title={"Liste des équipes"}
            // actions={
            //     <CreateTeamDialog createTeam={handleCreateTeam}>
            //         <Button size="sm">
            //             <IconUsersPlus />
            //             <span className="max-md:hidden ml-2">Créer une équipe</span>
            //         </Button>
            //     </CreateTeamDialog>
            // }
            />

            <HubContent>
                <TeamsList teams={paginated} currentPage={page} totalPages={totalPages} updateTeam={handleUpdateTeam} deleteSelectedTeams={handleDeleteTeams} searchLeaders={handleSearchLeaders} searchWriters={handleSearchWriters} />
            </HubContent>
        </>
    );
}
