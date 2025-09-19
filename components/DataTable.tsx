"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Columns, Filter, Rows, Search } from "lucide-react";
import type { Row as DataRow } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export interface Column<T extends DataRow> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  width?: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T extends DataRow> {
  columns: Column<T>[];
  data: T[];
  searchable?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  getRowId?: (row: T, index: number) => string;
  selectedRowId?: string;
}

export function DataTable<T extends DataRow>({
  columns,
  data,
  searchable = true,
  pageSize = 20,
  onRowClick,
  getRowId,
  selectedRowId,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [visibleColumns, setVisibleColumns] = useState(() => columns.map((col) => col.key as string));
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable");
  const [page, setPage] = useState(0);

  const filteredData = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return data.filter((row) => {
      const matchesSearch = !searchable || !lowerSearch
        ? true
        : columns.some((column) => {
            const value = row[column.key as keyof T];
            return value !== null && value !== undefined && String(value).toLowerCase().includes(lowerSearch);
          });
      if (!matchesSearch) return false;
      return columns.every((column) => {
        const filterValue = columnFilters[column.key as string];
        if (!filterValue) return true;
        const cell = row[column.key as keyof T];
        return cell !== null && cell !== undefined && String(cell).toLowerCase().includes(filterValue.toLowerCase());
      });
    });
  }, [columns, data, search, searchable, columnFilters]);

  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortKey as keyof T];
      const bValue = b[sortKey as keyof T];
      if (aValue === bValue) return 0;
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      return sortDirection === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
    return sorted;
  }, [filteredData, sortDirection, sortKey]);

  const pageCount = Math.max(1, Math.ceil(sortedData.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const pagedData = sortedData.slice(currentPage * pageSize, currentPage * pageSize + pageSize);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((current) =>
      current.includes(key) ? current.filter((col) => col !== key) : [...current, key]
    );
  };

  const densityClass = density === "compact" ? "py-2" : "py-3";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {searchable ? (
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search rows" className="pl-9" />
          </div>
        ) : null}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Columns className="h-4 w-4" /> Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {columns.map((column) => {
                const key = column.key as string;
                const checked = visibleColumns.includes(key);
                return (
                  <DropdownMenuItem key={key} onSelect={() => toggleColumnVisibility(key)}>
                    <label className="flex w-full cursor-pointer items-center gap-2 text-left">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleColumnVisibility(key)}
                        className="h-4 w-4"
                      />
                      <span>{column.header}</span>
                    </label>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setDensity(density === "comfortable" ? "compact" : "comfortable")}
          >
            <Rows className="h-4 w-4" /> {density === "comfortable" ? "Compact" : "Comfortable"}
          </Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="sticky top-0 bg-background">
              {columns
                .filter((column) => visibleColumns.includes(column.key as string))
                .map((column) => {
                  const key = column.key as string;
                  const isSorted = sortKey === key;
                  return (
                    <TableHead key={key} style={{ width: column.width }}>
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-2 text-left"
                        onClick={() => column.sortable !== false && toggleSort(key)}
                      >
                        <span>{column.header}</span>
                        {column.sortable === false ? null : (
                          <span className="text-xs text-muted-foreground">{isSorted ? (sortDirection === "asc" ? "↑" : "↓") : ""}</span>
                        )}
                      </button>
                      <div className="mt-2 flex items-center gap-1">
                        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                        <input
                          value={columnFilters[key] ?? ""}
                          onChange={(event) => {
                            const value = event.target.value;
                            setColumnFilters((current) => ({ ...current, [key]: value }));
                            setPage(0);
                          }}
                          className="h-8 w-full rounded-md border border-border bg-background px-2 text-xs"
                          placeholder="Filter"
                        />
                      </div>
                    </TableHead>
                  );
                })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pagedData.map((row, rowIndex) => {
              const rowId = getRowId ? getRowId(row, currentPage * pageSize + rowIndex) : ((row.id as string) ?? `${currentPage}-${rowIndex}`);
              const isSelected = selectedRowId === rowId;
              return (
                <TableRow
                  key={rowId}
                  className={`${densityClass} ${onRowClick ? "cursor-pointer" : ""} ${isSelected ? "bg-muted" : ""}`}
                  onClick={() => onRowClick?.(row)}
                >
                  {columns
                    .filter((column) => visibleColumns.includes(column.key as string))
                    .map((column) => {
                      const key = column.key as string;
                      const value = row[key as keyof T];
                      return (
                        <TableCell key={key} className={densityClass}>
                          {column.render ? column.render(value, row) : value === null || value === undefined ? "—" : String(value)}
                        </TableCell>
                      );
                    })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>
          Showing {pagedData.length ? currentPage * pageSize + 1 : 0}–
          {Math.min((currentPage + 1) * pageSize, sortedData.length)} of {sortedData.length}
        </span>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={currentPage === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span>
            Page {currentPage + 1} / {pageCount}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
            disabled={currentPage >= pageCount - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
