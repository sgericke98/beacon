import type { StepLogEntry } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TraceConsoleProps {
  logs: StepLogEntry[];
}

export function TraceConsole({ logs }: TraceConsoleProps) {
  return (
    <div className="rounded-2xl border border-border bg-background/60 p-4 shadow-inner">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Agent trace</h3>
        <span className="text-xs text-muted-foreground">{logs.length} events</span>
      </div>
      <ScrollArea className="h-64 w-full rounded-xl bg-background/70">
        <ol className="space-y-2 px-3 py-2 text-xs font-mono text-muted-foreground">
          {logs.length === 0 ? (
            <li className="text-muted-foreground/70">Awaiting agent activity…</li>
          ) : (
            logs.map((log) => (
              <li key={log.id}>
                <span className="text-primary">[{log.stepId}]</span> {log.message}
              </li>
            ))
          )}
        </ol>
      </ScrollArea>
    </div>
  );
}
