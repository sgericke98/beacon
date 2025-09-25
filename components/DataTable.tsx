interface DataTableProps {
  columns: { id: string; label: string; align?: "left" | "right" }[];
  rows: Record<string, string | number>[];
}

export function DataTable({ columns, rows }: DataTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background/70">
      <table className="min-w-full text-sm">
        <thead className="bg-muted/60 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            {columns.map((column) => {
              const alignClass = column.align === "right" ? "text-right" : "text-left";
              return (
                <th key={column.id} className={`px-4 py-3 ${alignClass}`}>
                  {column.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-muted/40">
              {columns.map((column) => {
                const alignClass = column.align === "right" ? "text-right" : "text-left";
                return (
                  <td key={column.id} className={`px-4 py-2 ${alignClass}`}>
                    {row[column.id] as React.ReactNode}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="px-4 py-6 text-center text-sm text-muted-foreground">No rows to display.</div>
      )}
    </div>
  );
}
