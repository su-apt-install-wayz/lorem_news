import React, { } from "react";
import { UserCardSkeleton } from "./UserCard";
import { SelectionProviderClient } from "../SelectionProviderClient";
import SelectableUserCard from "./SelectableUserCard";
import UsersListActions from "./UsersListActions";
import PaginationClient from "../PaginationClient";
import { Skeleton } from "../../ui/skeleton";
import { cn } from "@/lib/utils";
import { Spacing } from "../../Spacing";

export interface User {
    id: number;
    username: string;
    email: string;
    picture?: string;
    roles: string[];
    created_at?: string;
}

export default async function UsersList({ users, currentPage, totalPages, updateUser, deleteSelectedUsers }: { users: User[]; currentPage: number; totalPages: number; updateUser: (id: number, payload: { email: string; username: string; roles: string[] }) => Promise<boolean>; deleteSelectedUsers: (ids: number[]) => Promise<number[]>; }) {
    return (
        <SelectionProviderClient>
            <UsersListActions users={users} deleteSelectedUsers={deleteSelectedUsers} />

            <ul className="grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4">
                {users.map((user) => (
                    <li key={user.id}>
                        <SelectableUserCard user={user} updateUser={updateUser} />
                    </li>
                ))}
            </ul>

            <Spacing size={"xs"} />

            {totalPages > 1 && <PaginationClient currentPage={currentPage} totalPages={totalPages} />}
        </SelectionProviderClient>
    );
}

export function UsersListLoading(props: { className?: string }) {
    const usersPerPage = 10;

    return (
        <div className={cn("space-y-2", props.className)}>
            <div className="flex justify-between items-center gap-4 px-1">
                <Skeleton className="w-28 h-5 rounded bg-muted" />

                <div className="flex items-center gap-2">
                    <Skeleton className="w-44 h-8 rounded bg-muted" />
                    <Skeleton className="w-24 h-8 rounded bg-muted" />
                </div>
            </div>

            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4">
                {Array.from({ length: usersPerPage }).map((_, index) => (
                    <UserCardSkeleton key={index} />
                ))}
            </div>
        </div>
    );
}
