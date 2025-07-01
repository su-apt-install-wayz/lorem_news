"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function PaginationClient({
    currentPage,
    totalPages,
}: {
    currentPage: number;
    totalPages: number;
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const paginate = (page: number) => {
        if (page < 1 || page > totalPages) return;
        startTransition(() => {
            router.push(`?page=${page}`);
        });
    };

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => paginate(currentPage - 1)}
                        className={currentPage === 1 ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                    />
                </PaginationItem>

                {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;
                    return (
                        <PaginationItem key={index}>
                            <PaginationLink
                                className="cursor-pointer"
                                onClick={() => paginate(page)}
                                isActive={page === currentPage}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => paginate(currentPage + 1)}
                        className={currentPage === totalPages ? "opacity-50 pointer-events-none" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>

            {isPending && <div className="text-muted-foreground text-sm ml-2">Chargement...</div>}
        </Pagination>
    );
}
