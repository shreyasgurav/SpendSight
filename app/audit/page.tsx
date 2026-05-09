"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  Plus,
  Trash2,
  ArrowRight,
  Loader2,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TOOLS, calculateDefaultSpend, type UseCase } from "@/lib/pricing-data";
import { toast } from "sonner";

interface ToolEntry {
  id: string;
  toolKey: string;
  planKey: string;
  seats: number;
  monthlySpend: number;
  spendOverridden: boolean;
}

interface FormState {
  tools: ToolEntry[];
  teamSize: number;
  useCase: UseCase;
}

const STORAGE_KEY = "spendsight-form-state";
const USE_CASES: { value: UseCase; label: string }[] = [
  { value: "coding", label: "Coding" },
  { value: "writing", label: "Writing" },
  { value: "data", label: "Data Analysis" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed" },
];

function createEmptyTool(): ToolEntry {
  return {
    id: crypto.randomUUID(),
    toolKey: "",
    planKey: "",
    seats: 1,
    monthlySpend: 0,
    spendOverridden: false,
  };
}

function getDefaultState(): FormState {
  return {
    tools: [createEmptyTool()],
    teamSize: 5,
    useCase: "coding",
  };
}

export default function AuditPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>(getDefaultState());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as FormState;
        if (parsed.tools && parsed.tools.length > 0) {
          setFormState(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formState));
    }
  }, [formState, hydrated]);

  const runningTotal = formState.tools.reduce(
    (sum, t) => sum + (t.monthlySpend || 0),
    0
  );

  const updateTool = useCallback(
    (id: string, updates: Partial<ToolEntry>) => {
      setFormState((prev) => ({
        ...prev,
        tools: prev.tools.map((t) => {
          if (t.id !== id) return t;
          const updated = { ...t, ...updates };
          // Auto-calculate spend if not overridden
          if (
            !updated.spendOverridden &&
            updated.toolKey &&
            updated.planKey &&
            (updates.toolKey || updates.planKey || updates.seats)
          ) {
            updated.monthlySpend = calculateDefaultSpend(
              updated.toolKey,
              updated.planKey,
              updated.seats
            );
          }
          return updated;
        }),
      }));
    },
    []
  );

  const addTool = () => {
    setFormState((prev) => ({
      ...prev,
      tools: [...prev.tools, createEmptyTool()],
    }));
  };

  const removeTool = (id: string) => {
    setFormState((prev) => ({
      ...prev,
      tools: prev.tools.filter((t) => t.id !== id),
    }));
  };

  const handleSubmit = async () => {
    const validTools = formState.tools.filter(
      (t) => t.toolKey && t.planKey && t.seats > 0
    );

    if (validTools.length === 0) {
      toast.error("Please add at least one tool to audit.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tools: validTools.map((t) => ({
            toolKey: t.toolKey,
            planKey: t.planKey,
            seats: t.seats,
            monthlySpend: t.monthlySpend,
            useCase: formState.useCase,
            teamSize: formState.teamSize,
          })),
          teamSize: formState.teamSize,
          useCase: formState.useCase,
        }),
      });

      if (!res.ok) {
        throw new Error("Audit failed");
      }

      const data = await res.json();

      // Store results in sessionStorage for the results page
      sessionStorage.setItem("spendsight-audit-result", JSON.stringify(data));

      router.push(`/results/${data.shareSlug}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg tracking-tight">
              SpendSight
            </span>
          </Link>
          {runningTotal > 0 && (
            <Badge variant="outline" className="text-sm font-mono">
              <DollarSign className="h-3 w-3 mr-0.5" />
              {runningTotal.toLocaleString()}/mo
            </Badge>
          )}
        </div>
      </nav>

      <main className="flex-1 py-8 sm:py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Audit your AI spend
            </h1>
            <p className="text-muted-foreground">
              Add the AI tools your team pays for. We will check every plan and
              find where you can save.
            </p>
          </div>

          {/* Global settings */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teamSize">Team size</Label>
                  <Input
                    id="teamSize"
                    type="number"
                    min={1}
                    max={10000}
                    value={formState.teamSize}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        teamSize: parseInt(e.target.value) || 1,
                      }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="useCase">Primary use case</Label>
                  <Select
                    value={formState.useCase}
                    onValueChange={(v) => {
                      if (v)
                        setFormState((prev) => ({
                          ...prev,
                          useCase: v as UseCase,
                        }));
                    }}
                  >
                    <SelectTrigger id="useCase" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {USE_CASES.map((uc) => (
                        <SelectItem key={uc.value} value={uc.value}>
                          {uc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tool entries */}
          <div className="space-y-4">
            {formState.tools.map((tool, index) => (
              <Card key={tool.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      Tool {index + 1}
                    </CardTitle>
                    {formState.tools.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTool(tool.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive cursor-pointer"
                        aria-label="Remove tool"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Tool selector */}
                    <div className="space-y-2">
                      <Label>Tool</Label>
                      <Select
                        value={tool.toolKey}
                        onValueChange={(v) => {
                          if (v)
                            updateTool(tool.id, {
                              toolKey: v,
                              planKey: "",
                              spendOverridden: false,
                            });
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select tool" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(TOOLS).map(([key, info]) => (
                            <SelectItem key={key} value={key}>
                              {info.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Plan selector */}
                    <div className="space-y-2">
                      <Label>Plan</Label>
                      <Select
                        value={tool.planKey}
                        onValueChange={(v) => {
                          if (v)
                            updateTool(tool.id, {
                              planKey: v,
                              spendOverridden: false,
                            });
                        }}
                        disabled={!tool.toolKey}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select plan" />
                        </SelectTrigger>
                        <SelectContent>
                          {tool.toolKey &&
                            Object.entries(
                              TOOLS[tool.toolKey]?.plans || {}
                            ).map(([key, plan]) => (
                              <SelectItem key={key} value={key}>
                                {plan.name}
                                {plan.pricePerUser > 0 &&
                                  ` ($${plan.pricePerUser}/user/mo)`}
                                {plan.pricePerUser === 0 && " (Free)"}
                                {plan.isCustom && " (Custom)"}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Seats */}
                    <div className="space-y-2">
                      <Label>Seats</Label>
                      <Input
                        type="number"
                        min={1}
                        max={10000}
                        value={tool.seats}
                        onChange={(e) =>
                          updateTool(tool.id, {
                            seats: parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </div>

                    {/* Monthly spend */}
                    <div className="space-y-2">
                      <Label>Monthly spend ($)</Label>
                      <Input
                        type="number"
                        min={0}
                        step={0.01}
                        value={tool.monthlySpend}
                        onChange={(e) =>
                          updateTool(tool.id, {
                            monthlySpend: parseFloat(e.target.value) || 0,
                            spendOverridden: true,
                          })
                        }
                        placeholder="Auto-calculated"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add tool button */}
          <Button
            variant="outline"
            onClick={addTool}
            className="mt-4 w-full sm:w-auto cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add another tool
          </Button>

          <Separator className="my-8" />

          {/* Running total + submit */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Current monthly spend
              </p>
              <p className="text-3xl font-bold font-mono">
                ${runningTotal.toLocaleString()}
                <span className="text-base font-normal text-muted-foreground">
                  /mo
                </span>
              </p>
            </div>
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                formState.tools.every((t) => !t.toolKey || !t.planKey)
              }
              className="px-8 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  Run my audit
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
