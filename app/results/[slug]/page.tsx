"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BarChart3,
  ArrowRight,
  CheckCircle2,
  TrendingDown,
  Loader2,
  Share2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { AuditSummary, ToolAuditResult } from "@/lib/audit-engine";

interface AuditData extends AuditSummary {
  shareSlug: string;
  auditId: string | null;
  stored: boolean;
}

function useCountUp(end: number, duration: number = 1500) {
  const [count, setCount] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    if (end === 0) {
      setCount(0);
      return;
    }

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const progress = Math.min((timestamp - startTime.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    rafId.current = requestAnimationFrame(animate);

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [end, duration]);

  return count;
}

function getConfidenceBadge(confidence: ToolAuditResult["confidence"]) {
  switch (confidence) {
    case "high":
      return (
        <Badge variant="outline" className="text-xs border-green-300 text-green-700">
          High confidence
        </Badge>
      );
    case "medium":
      return (
        <Badge variant="outline" className="text-xs border-yellow-300 text-yellow-700">
          Medium confidence
        </Badge>
      );
    case "low":
      return (
        <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
          Low confidence
        </Badge>
      );
  }
}

function getTypeBadge(type: ToolAuditResult["type"], savings: number) {
  switch (type) {
    case "optimal":
      return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Optimal
        </Badge>
      );
    case "downgrade":
      return (
        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          <TrendingDown className="h-3 w-3 mr-1" />
          Downgrade · Save ${savings}/mo
        </Badge>
      );
    case "switch_tool":
      return (
        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
          <Sparkles className="h-3 w-3 mr-1" />
          Switch · Save ${savings}/mo
        </Badge>
      );
    case "redundant":
      return (
        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Redundant · Save ${savings}/mo
        </Badge>
      );
    default:
      if (savings > 0) {
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            Save ${savings}/mo
          </Badge>
        );
      }
      return null;
  }
}

export default function ResultsPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [auditData, setAuditData] = useState<AuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [leadEmail, setLeadEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);

  useEffect(() => {
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
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    if (!auditData || auditData.savingsCategory === "optimal") return;
    setSummaryLoading(true);
    fetch("/api/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auditData }),
    })
      .then((res) => res.json())
      .then((data) => setAiSummary(data.summary || null))
      .catch(() => {})
      .finally(() => setSummaryLoading(false));
  }, [auditData]);

  useEffect(() => {
    if (!auditData) return;
    const timer = setTimeout(() => setShowLeadForm(true), 10000);
    return () => clearTimeout(timer);
  }, [auditData]);

  const handleLeadSubmit = async () => {
    if (!leadEmail || leadSubmitting) return;
    setLeadSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: leadEmail, honeypot }),
      });
      setLeadSubmitted(true);
      toast.success("Saved! Check your email for your audit report.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  };

  const animatedSavings = useCountUp(auditData?.totalMonthlySavings || 0);
  const animatedAnnual = useCountUp(auditData?.totalAnnualSavings || 0);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

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
  const isHighSavings = auditData.savingsCategory === "high";
  const actionableResults = auditData.results.filter((r) => r.monthlySavings > 0);
  const optimalResults = auditData.results.filter((r) => r.type === "optimal");

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
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleShare}
              className="cursor-pointer"
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            <Link href="/audit">
              <Button size="sm" variant="outline" className="cursor-pointer">
                New audit
              </Button>
            </Link>
          </div>
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
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  No immediate savings found. Your AI tool stack is well-suited
                  for your team size and use case.
                </p>
              </>
            ) : (
              <>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mb-4"
                >
                  <TrendingDown className="h-3 w-3 mr-1" />
                  {actionableResults.length} optimization
                  {actionableResults.length !== 1 ? "s" : ""} found
                </Badge>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 tracking-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                    ${animatedSavings.toLocaleString()}/mo
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground">
                  ${animatedAnnual.toLocaleString()}/year in potential savings
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Current: ${auditData.totalCurrentSpend.toLocaleString()}/mo →
                  Projected: ${auditData.totalProjectedSpend.toLocaleString()}
                  /mo
                </p>
              </>
            )}
          </section>

          {/* Credex CTA for high savings */}
          {isHighSavings && (
            <Card className="mb-8 border-primary/50 bg-primary/5">
              <CardContent className="py-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-lg mb-1">
                      Unlock even more savings with Credex
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      With ${auditData.totalMonthlySavings}+/mo in potential
                      savings, you qualify for discounted AI credits through
                      Credex.
                    </p>
                  </div>
                  <a
                    href="https://credex.rocks"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button className="cursor-pointer whitespace-nowrap">
                      Talk to Credex
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actionable results */}
          {actionableResults.length > 0 && (
            <>
              <h2 className="text-xl font-bold mb-4">
                Recommended actions ({actionableResults.length})
              </h2>
              <div className="space-y-4 mb-8">
                {actionableResults.map((result, i) => (
                  <Card
                    key={`action-${result.tool}-${i}`}
                    className="border-l-4 border-l-yellow-400"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-base">
                            {result.toolName}
                          </CardTitle>
                          <span className="text-sm text-muted-foreground">
                            {result.currentPlan} · ${result.currentSpend}/mo
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTypeBadge(result.type, result.monthlySavings)}
                          {getConfidenceBadge(result.confidence)}
                        </div>
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
            </>
          )}

          {/* Optimal tools */}
          {optimalResults.length > 0 && (
            <>
              <Separator className="my-8" />
              <h2 className="text-xl font-bold mb-4">
                Already optimized ({optimalResults.length})
              </h2>
              <div className="space-y-3 mb-12">
                {optimalResults.map((result, i) => (
                  <Card
                    key={`optimal-${result.tool}-${i}`}
                    className="border-green-200 dark:border-green-900"
                  >
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <span className="font-medium">{result.toolName}</span>
                          <span className="text-sm text-muted-foreground">
                            {result.currentPlan} · ${result.currentSpend}/mo
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-green-300 text-green-700"
                        >
                          No changes needed
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* AI Summary */}
          {(summaryLoading || aiSummary) && (
            <>
              <Separator className="my-8" />
              <h2 className="text-xl font-bold mb-4">AI-powered summary</h2>
              {summaryLoading ? (
                <Card>
                  <CardContent className="py-6 flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Generating your personalized summary...
                    </span>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-6">
                    <p className="text-sm leading-relaxed">{aiSummary}</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Lead Capture */}
          {showLeadForm && !leadSubmitted && (
            <>
              <Separator className="my-8" />
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="py-6">
                  <h3 className="font-semibold text-lg mb-1">
                    Save your audit report
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get a copy of your results emailed to you. No spam, ever.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Label htmlFor="lead-email" className="sr-only">
                        Email
                      </Label>
                      <Input
                        id="lead-email"
                        type="email"
                        placeholder="you@company.com"
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleLeadSubmit()
                        }
                      />
                    </div>
                    <input
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      className="hidden"
                      tabIndex={-1}
                      autoComplete="off"
                      aria-hidden="true"
                    />
                    <Button
                      onClick={handleLeadSubmit}
                      disabled={!leadEmail || leadSubmitting}
                      className="cursor-pointer"
                    >
                      {leadSubmitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Send me my report"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {leadSubmitted && (
            <>
              <Separator className="my-8" />
              <Card className="border-green-200 bg-green-50 dark:bg-green-950">
                <CardContent className="py-6 flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <p className="text-sm">Report saved! Check your inbox.</p>
                </CardContent>
              </Card>
            </>
          )}

          {/* Bottom CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Button
              size="lg"
              variant="outline"
              onClick={handleShare}
              className="cursor-pointer"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share this audit
            </Button>
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
            Pricing data verified as of May 2025. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
