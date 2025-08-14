"use client";

import { UserCard } from "./UserCard";
import { User } from "./UsersList";
import { useSelection } from "../SelectionProviderClient";
import { useOptimistic } from "react";

export default function SelectableUserCard({ user, updateUser }: { user: User; updateUser: (id: number, payload: { email: string; username: string; roles: string[] }) => Promise<boolean>; }) {
    // const { data: session } = useSession();
    // const currentUserId = session?.user?.id;
    const currentUserId = 1;

    const { selectedIds, toggle } = useSelection();
    const isSelf = user.id === currentUserId;
    const isSelected = selectedIds.includes(user.id);

    const [optimisticUser, setOptimisticUser] = useOptimistic(user);

    return (
        <UserCard
            user={optimisticUser}
            selected={isSelected}
            disabled={isSelf}
            onToggle={(id, checked) => {
                if (!isSelf) toggle(id, checked);
            }}
            updateUser={updateUser}
            onOptimisticUpdate={setOptimisticUser}
        />
    );
}
