import type { AgentStep, AgentStepId } from "@/lib/types";
import { Check } from "lucide-react";

interface StepperProps {
  steps: AgentStep[];
  activeStepId: AgentStepId | null;
  completedSteps: Set<AgentStepId>;
}

export function Stepper({ steps, activeStepId, completedSteps }: StepperProps) {
  return (
    <ol className="flex flex-wrap gap-4 text-sm">
      {steps.map((step, index) => {
        const isActive = step.id === activeStepId;
        const isDone = completedSteps.has(step.id);
        return (
          <li key={step.id} className="flex items-center gap-2">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold transition-all ${
                isDone
                  ? "border-primary bg-primary text-primary-foreground"
                  : isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground"
              }`}
            >
              {isDone ? <Check className="h-4 w-4" /> : index + 1}
            </span>
            <div>
              <p className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                {step.label}
              </p>
              <p className="text-xs text-muted-foreground/80">{step.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
