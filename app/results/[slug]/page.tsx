"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BarChart3,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { AuditSummary } from "@/lib/audit-engine";

interface AuditData extends AuditSummary {
  shareSlug: string;
  auditId: string | null;
  stored: boolean;
}

export default function ResultsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to load from sessionStorage first
    const cached = sessionStorage.getItem("spendsight-audit-result");
    if (cached) {
      try {
        const data = JSON.parse(cached) as AuditData;
        if (data.shareSlug === slug) {
          setAuditData(data);
          setLoading(false);
          return;
        }
      } catch {
        // ignore
      }
    }
    // For now, just show not found if not in session
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!auditData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold mb-4">Audit not found</h1>
        <p className="text-muted-foreground mb-6">
          This audit may have expired or does not exist.
        </p>
        <Link href="/audit">
          <Button>Start a new audit</Button>
        </Link>
      </div>
    );
  }

  const isOptimal = auditData.savingsCategory === "optimal";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg tracking-tight">
              SpendSight
            </span>
          </Link>
          <Link href="/audit">
            <Button size="sm" variant="outline">
              New audit
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 py-8 sm:py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero savings */}
          <section className="text-center mb-12">
            {isOptimal ? (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  Your spend is optimized
                </h1>
                <p className="text-lg text-muted-foreground">
                  No immediate savings found. Your AI tool stack looks good.
                </p>
              </>
            ) : (
              <>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mb-4"
                >
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Savings found
                </Badge>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                    ${auditData.totalMonthlySavings.toLocaleString()}/mo
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  ${auditData.totalAnnualSavings.toLocaleString()}/year in
                  potential savings
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Current: ${auditData.totalCurrentSpend.toLocaleString()}/mo →
                  Projected: ${auditData.totalProjectedSpend.toLocaleString()}
                  /mo
                </p>
              </>
            )}
          </section>

          {/* Results cards */}
          <h2 className="text-xl font-bold mb-4">Tool breakdown</h2>
          <div className="space-y-4 mb-12">
            {auditData.results.map((result, i) => (
              <Card
                key={`${result.tool}-${i}`}
                className={
                  result.type === "optimal"
                    ? "border-green-200 dark:border-green-900"
                    : result.monthlySavings > 0
                      ? "border-yellow-200 dark:border-yellow-900"
                      : ""
                }
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {result.toolName}
                    </CardTitle>
                    {result.type === "optimal" ? (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Optimal
                      </Badge>
                    ) : result.monthlySavings > 0 ? (
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800"
                      >
                        Save ${result.monthlySavings}/mo
                      </Badge>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium mb-1">
                    {result.recommendedAction}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.reasoning}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Link href="/audit">
              <Button size="lg" className="cursor-pointer">
                Run another audit
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4 mt-auto">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              SpendSight by Credex
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Pricing data verified as of May 2025.
          </p>
        </div>
      </footer>
    </div>
  );
}
