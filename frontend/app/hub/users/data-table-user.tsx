"use client"

import * as React from "react"
import { useState } from "react"
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import { z } from "zod"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { toast } from "sonner" 
import api from "@/lib/api"
import { MultiRoleSelector } from "@/components/MultiSelected"

export const schema = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  roles: z.string(),
})

const columns: ColumnDef<z.infer<typeof schema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "username",
    header: "Nom",
    cell: ({ row }) => (
      <div className="w-32 overflow-hidden text-ellipsis whitespace-nowrap">
        <Label className="text-foreground w-fit px-0 text-left">
          {row.original.username}
        </Label>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <div className="w-32">
        <Label className="text-foreground w-fit px-0 text-left">
          {row.original.email}
        </Label>
      </div>
    ),
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => (
      <div className="w-32">
        <Label className="text-foreground w-fit px-0 text-left">
          {row.original.roles}
        </Label>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionsCell item={row.original} />,
  },  
]

export function DataTable({ data: initialData }: { data: z.infer<typeof schema>[] }) {
  const [data] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  return (
    <Tabs defaultValue="outline" className="w-full flex-col justify-start gap-6">
      <TabsContent value="outline" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </TabsContent>
    </Tabs>
  )
}

function ActionsCell({ item }: { item: z.infer<typeof schema> }) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)

  const [username, setUsername] = useState(item.username)
  const [email, setEmail] = useState(item.email)
  const [loading, setLoading] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState<string[]>(Array.isArray(item.roles) ? item.roles : [item.roles]);


  const handleUpdate = async () => {
    setLoading(true)
    try {
      await api.patch(`/api/users/${item.id}`, {
        username,
        email,
        selectedRoles,
      })
      toast.success("Utilisateur mis à jour avec succès !")
    } catch (error) {
      console.error(error)
      toast.error("Erreur lors de la mise à jour !")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="w-full hover:bg-muted rounded-sm cursor-pointer"
        >
          Modifier
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.username}</DrawerTitle>
          <DrawerDescription>
            Modification des informations de l&apos;utilisateur
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="username">Nom</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="roles">Rôles</Label>
              <MultiRoleSelector
                selectedRoles={selectedRoles}
                setSelectedRoles={setSelectedRoles}
                availableRoles={["ROLE_ADMIN", "ROLE_EDITOR", "ROLE_VIEWER", "ROLE_LEADER"]}
              />
            </div>
          </div>
        </div>
        <DrawerFooter className="flex flex-col gap-2">
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline">Fermer</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
