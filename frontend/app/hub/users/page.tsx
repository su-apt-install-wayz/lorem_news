import { HubHeader } from "@/components/hub/hub-header";
import { HubContent } from "@/components/hub/hub-content";
import { getUsers, handleDeleteUsers, handleUpdateUser } from "./actions";
import UsersList from "@/components/hub/users/UsersList";

type SearchParams = { page?: string };
type PageProps = { searchParams: Promise<SearchParams> };

export default async function HubUsersPage({ searchParams }: PageProps) {
    const sp = await searchParams;
    const page = Number(sp.page ?? 1);

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
