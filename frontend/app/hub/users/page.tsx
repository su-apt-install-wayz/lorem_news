import { HubHeader } from "@/components/hub/hub-header";
import { HubContent } from "@/components/hub/hub-content";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserRoundPlus } from "lucide-react";
import { deleteUsers, getUsers, updateUser } from "./actions";
import UsersList from "@/components/users/UsersList";
import { revalidatePath } from "next/cache";

export async function handleUpdateUser(id: number, payload: { email: string; username: string; roles: string[] }) {
    "use server";
    const success = await updateUser(id, payload);
    if (success) {
        revalidatePath("/hub/users");
    }
    return success;
}

export async function handleDeleteUsers(ids: number[]): Promise<number[]> {
    "use server";
    const res = await deleteUsers(ids);
    revalidatePath("/hub/users");
    return res;
}

export default async function HubUsersPage(props: { searchParams: { page?: string } }) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page ?? 1);

    const users = await getUsers();
    const itemsPerPage = 10;
    const totalPages = Math.ceil(users.length / itemsPerPage);
    const paginatedUsers = users.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <>
            <HubHeader title={"Liste des utilisateurs"} />

            <HubContent>
                <UsersList users={paginatedUsers} currentPage={page} totalPages={totalPages} updateUser={handleUpdateUser} deleteSelectedUsers={handleDeleteUsers} />
            </HubContent>
        </>
    );
}
