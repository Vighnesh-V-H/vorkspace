"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Bug,
  Lightbulb,
  Plus,
  Sparkles,
  TicketCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

import {
  useTicketsQuery,
  type TicketRow,
} from "@/lib/queries/client/ticket";

import { CreateTicketDialog } from "./create-ticket-dialog";


const TAG_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; className: string }
> = {
  bug: {
    label: "Bug",
    icon: <Bug className="size-3" />,
    className:
      "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20",
  },
  feature: {
    label: "Feature",
    icon: <Sparkles className="size-3" />,
    className:
      "bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20",
  },
  improvement: {
    label: "Improvement",
    icon: <Lightbulb className="size-3" />,
    className:
      "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20",
  },
};


const columns: ColumnDef<TicketRow>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <span className="font-mono text-xs text-muted-foreground">
        #{row.original.id}
      </span>
    ),
    size: 70,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Title
        <ArrowUpDown className="size-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{row.original.title}</span>
        {row.original.description && (
          <span className="text-xs text-muted-foreground line-clamp-1 max-w-[300px]">
            {row.original.description}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "tag",
    header: "Tag",
    cell: ({ row }) => {
      const cfg = TAG_CONFIG[row.original.tag];
      if (!cfg) return null;
      return (
        <Badge
          variant="outline"
          className={`gap-1 font-medium ${cfg.className}`}
        >
          {cfg.icon}
          {cfg.label}
        </Badge>
      );
    },
    filterFn: (row, _id, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      return row.original.tag === filterValue;
    },
  },
  {
    accessorKey: "assigneeName",
    header: "Assigned To",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm">{row.original.assigneeName}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.assigneeEmail}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Created
        <ArrowUpDown className="size-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {new Date(row.original.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    accessorKey: "closedAt",
    header: "Status",
    cell: ({ row }) =>
      row.original.closedAt ? (
        <Badge
          variant="outline"
          className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        >
          Closed
        </Badge>
      ) : (
        <Badge
          variant="outline"
          className="bg-sky-500/10 text-sky-400 border-sky-500/20"
        >
          Open
        </Badge>
      ),
  },
];


export default function TicketsPage() {
  const params = useParams();
  const orgId = params?.id as string;

  const { data: tickets = [], isLoading } = useTicketsQuery(orgId);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [tagFilter, setTagFilter] = React.useState<string>("all");
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const table = useReactTable({
    data: tickets,
    columns,
    state: { sorting, columnFilters, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  React.useEffect(() => {
    table.getColumn("tag")?.setFilterValue(tagFilter === "all" ? "" : tagFilter);
  }, [tagFilter, table]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <TicketCheck className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Tickets</h2>
            <p className="text-sm text-muted-foreground">
              Manage and assign tickets to organization members
            </p>
          </div>
        </div>
        <Button onClick={() => setDialogOpen(true)} size="default">
          <Plus className="size-4" data-icon="inline-start" />
          New Ticket
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search tickets…"
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-xs"
        />

        <div className="flex gap-1.5">
          {["all", "bug", "feature", "improvement"].map((tag) => {
            const isActive = tagFilter === tag;
            const cfg = tag !== "all" ? TAG_CONFIG[tag] : null;
            return (
              <Button
                key={tag}
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setTagFilter(tag)}
                className={`gap-1.5 capitalize ${isActive ? "ring-1 ring-ring/20" : ""}`}
              >
                {cfg?.icon}
                {tag === "all" ? "All" : cfg?.label}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="rounded-xl border bg-card/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <TicketCheck className="size-8 opacity-40" />
                    <p className="text-sm">No tickets yet</p>
                    <p className="text-xs">
                      Create a ticket to get started
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {!isLoading && tickets.length > 0 && (
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            {table.getFilteredRowModel().rows.length} of {tickets.length} tickets
          </span>
          <span className="text-border">•</span>
          <span>
            {tickets.filter((t) => !t.closedAt).length} open
          </span>
          <span className="text-border">•</span>
          <span>
            {tickets.filter((t) => t.closedAt).length} closed
          </span>
        </div>
      )}

      <CreateTicketDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        orgId={orgId}
      />
    </div>
  );
}
