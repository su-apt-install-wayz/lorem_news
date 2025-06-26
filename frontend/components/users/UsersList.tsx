"use client";

import React, { useEffect, useState } from "react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Spacing } from "@/components/Spacing";
import { cn } from "@/lib/utils";
import { UserCard, UserCardSkeleton } from "./UserCard";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SelectableLabelCheckbox } from "@/components/users/SelectableLabelCheckbox";
import { Button } from "@/components/ui/button";
import { Filter, UserRoundX } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export interface User {
    id: number;
    username: string;
    email: string;
    picture?: string;
    roles: string[];
    created_at?: string;
}

interface UsersListProps {
    users: User[];
    className?: string;
    loading?: boolean;
    usersPerPage?: number;
    onSelectionChange?: (selectedIds: number[]) => void;
}

const UsersList: React.FC<UsersListProps> = ({ users, className, loading = false, usersPerPage = 8, onSelectionChange }) => {
    const [currentPage, setCurrentPage] = useState<number>(1);

    const totalPages = Math.ceil(users.length / usersPerPage);
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const hasSelection = selectedIds.length > 0;

    useEffect(() => {
        onSelectionChange?.(selectedIds);
    }, [selectedIds]);

    const paginate = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleToggleUser = (userId: number, checked: boolean) => {
        setSelectedIds(prev =>
            checked ? [...prev, userId] : prev.filter(id => id !== userId)
        );
    };

    const isPageFullySelected = currentUsers.every(user => selectedIds.includes(user.id));

    const handleTogglePageSelect = (checked: boolean) => {
        if (checked) {
            const toAdd = currentUsers
                .filter(user => !selectedIds.includes(user.id))
                .map(user => user.id);
            setSelectedIds(prev => [...prev, ...toAdd]);
        } else {
            setSelectedIds(prev => prev.filter(id => !currentUsers.some(u => u.id === id)));
        }
    };

    const handleDelete = async () => {
        try {
            await Promise.all(
                selectedIds.map(id => api.delete(`/api/users/${id}`))
            );
            console.log("Utilisateurs supprimés");
            // revalidatePath(`/hub/users`);
        } catch (e) {
            console.error("Erreur suppression :", e);
        }
    };

    if (loading) {
        return (
            <div className={cn("space-y-2", className)}>
                <div className="flex justify-between items-center gap-4 px-1">
                    <Skeleton className="w-28 h-5 rounded bg-muted" />

                    <div className="flex items-center gap-2">
                        <Skeleton className="w-44 h-9 rounded bg-muted" />
                        <Skeleton className="w-24 h-9 rounded bg-muted" />
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

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex justify-between items-center gap-4 px-1">
                <SelectableLabelCheckbox
                    labelUnchecked="Tout sélectionner"
                    labelChecked="Tout désélectionner"
                    checked={isPageFullySelected}
                    onChange={handleTogglePageSelect}
                />

                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className={hasSelection ? "" : "cursor-not-allowed opacity-50"}>
                                    <Button size="sm" variant="destructive" disabled={!hasSelection} onClick={handleDelete}>
                                        <UserRoundX />
                                        <span className="max-md:hidden ml-2">Supprimer la sélection</span>
                                    </Button>
                                </span>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{hasSelection ? "Supprimer la sélection" : "Aucun utilisateur sélectionné"}</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant={"outline"} className="flex items-center gap-2 cursor-pointer">
                                <Filter />
                                <span>Filtrer</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="z-99">
                            <SheetHeader>
                                <SheetTitle>Filtres</SheetTitle>
                                <SheetDescription>Affinez votre recherche en appliquant des filtres.</SheetDescription>
                            </SheetHeader>
                            <div className="flex flex-col gap-3 px-2">
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(290px,1fr))] gap-4">
                {currentUsers.map(user => (
                    <UserCard
                        key={user.id}
                        user={user}
                        selected={selectedIds.includes(user.id)}
                        onToggle={handleToggleUser}
                    />
                ))}
            </div>
            {users.length > usersPerPage && (
                <>
                    <Spacing size="sm" />
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={() => paginate(currentPage - 1)}
                                    className={currentPage === 1 ? "opacity-50 pointer-events-none" : ""}
                                />
                            </PaginationItem>
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <PaginationItem key={index}>
                                    <PaginationLink href="#" onClick={() => paginate(index + 1)} isActive={currentPage === index + 1}>
                                        {index + 1}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={() => paginate(currentPage + 1)}
                                    className={currentPage === totalPages ? "opacity-50 pointer-events-none" : ""}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </>
            )}
        </div>
    );
};

export default UsersList;
