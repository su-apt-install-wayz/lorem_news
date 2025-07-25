"use client";

import { useOptimistic } from "react";
import { useSelection } from "@/components/hub/SelectionProviderClient";
import TeamCard from "./TeamCard";
import { Team } from "./TeamsList";

export default function SelectableTeamCard({ team, updateTeam }: { team: Team; updateTeam: (id: number, payload: { name: string; leaderId: number }) => Promise<{ success: boolean; message?: string }>; }) {
    const { selectedIds, toggle } = useSelection();
    const isSelected = selectedIds.includes(team.id);

    const [optimisticTeam, setOptimisticTeam] = useOptimistic(team);

    return (
        <TeamCard
            team={optimisticTeam}
            selected={isSelected}
            onToggle={(id, checked) => toggle(id, checked)}
            updateTeam={updateTeam}
            onOptimisticUpdate={setOptimisticTeam}
        />
    );
}
