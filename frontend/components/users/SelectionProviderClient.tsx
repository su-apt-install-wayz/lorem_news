"use client";

import { createContext, useContext, useState } from "react";
import { User } from "./UsersList";

type Context = {
    selectedIds: number[];
    setSelectedIds: React.Dispatch<React.SetStateAction<number[]>>;
    toggle: (id: number, checked: boolean) => void;
    toggleAll: (ids: number[]) => void;
    isPageFullySelected: (ids: number[]) => boolean;
};

const SelectionContext = createContext<Context | null>(null);

export function SelectionProviderClient({ children, users }: { children: React.ReactNode; users: User[] }) {
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const toggle = (id: number, checked: boolean) => {
        setSelectedIds((prev) =>
            checked ? [...prev, id] : prev.filter((i) => i !== id)
        );
    };

    const toggleAll = (ids: number[]) => {
        const allSelected = ids.every((id) => selectedIds.includes(id));
        setSelectedIds(allSelected ? selectedIds.filter((id) => !ids.includes(id)) : [...new Set([...selectedIds, ...ids])]);
    };

    const isPageFullySelected = (ids: number[]) => ids.every((id) => selectedIds.includes(id));

    return (
        <SelectionContext.Provider value={{ selectedIds, setSelectedIds, toggle, toggleAll, isPageFullySelected }}>
            {children}
        </SelectionContext.Provider>
    );
}

export function useSelection() {
    const ctx = useContext(SelectionContext);
    if (!ctx) throw new Error("useSelection must be used inside provider");

    const { selectedIds, setSelectedIds, toggle, toggleAll, isPageFullySelected } = ctx;

    return {
        selectedIds,
        toggle,
        toggleAll,
        isPageFullySelected,
        clearSelection: () => setSelectedIds([]),
    };
}

