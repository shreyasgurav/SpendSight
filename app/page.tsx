import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Shield,
  Zap,
  Users,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="font-semibold text-lg tracking-tight">
              SpendSight
            </span>
          </div>
          <Link href="/audit">
            <Button size="sm" className="cursor-pointer">
              Start Audit
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1">
        <section className="py-20 sm:py-32 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              Free tool for startups
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Stop guessing what your AI tools{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">
                actually cost you
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Paste your subscriptions. Get an instant audit. Find out exactly
              where you are overspending on Cursor, Claude, ChatGPT, Copilot,
              and more.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/audit">
                <Button
                  size="lg"
                  className="text-base px-8 h-12 cursor-pointer"
                >
                  Audit my AI spend - it&apos;s free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              No login. No credit card. Takes 2 minutes.
            </p>
          </div>
        </section>

        {/* Social proof (mocked) */}
        <section className="border-y border-border/40 bg-muted/30 py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <p className="text-3xl font-bold">$340/mo</p>
                <p className="text-sm text-muted-foreground mt-1">
                  average savings found per audit
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold">2 min</p>
                <p className="text-sm text-muted-foreground mt-1">
                  to complete your audit
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold">8 tools</p>
                <p className="text-sm text-muted-foreground mt-1">
                  analyzed with real pricing data
                </p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-6">
              * Metrics based on early testing (mocked for illustration)
            </p>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              How it works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    Add your AI tools
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Select the tools you pay for, your plan, number of seats,
                    and monthly spend. We support Cursor, Copilot, Claude,
                    ChatGPT, Gemini, Windsurf, and API usage.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Get your audit</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Our engine checks if you are on the right plan, finds
                    cheaper alternatives, detects redundant tools, and
                    calculates your total savings.
                  </p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    Share and save
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Share your audit via a unique link. For significant savings,
                    connect with Credex to get discounted AI credits and save
                    even more.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 bg-muted/30 border-t border-border/40">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Built for engineering teams
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: TrendingDown,
                  title: "Plan optimization",
                  desc: "Detects overspend from wrong-tier plans, like Team plans for solo users.",
                },
                {
                  icon: Shield,
                  title: "Redundancy detection",
                  desc: "Spots overlapping tools, like Cursor + Copilot for the same coding workflow.",
                },
                {
                  icon: Zap,
                  title: "Real pricing data",
                  desc: "Every number traced to the vendor's official pricing page. Updated weekly.",
                },
                {
                  icon: Users,
                  title: "Team-aware",
                  desc: "Recommendations factor in your team size, use case, and actual workflow.",
                },
                {
                  icon: BarChart3,
                  title: "AI-powered summary",
                  desc: "Get a personalized paragraph summarizing your audit, written by Claude.",
                },
                {
                  icon: ArrowRight,
                  title: "Shareable reports",
                  desc: "Every audit gets a unique URL with proper link previews for sharing.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="flex gap-4 p-4 rounded-lg"
                >
                  <feature.icon className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Frequently asked questions
            </h2>
            <div className="space-y-8">
              {[
                {
                  q: "Is this actually free?",
                  a: "Yes. No credit card, no login required. You get full audit results instantly.",
                },
                {
                  q: "Do you store my data?",
                  a: "Only if you choose to save or share your report. We strip identifying details from public links.",
                },
                {
                  q: "How accurate is the audit?",
                  a: "Pricing data is verified against official vendor pages. Every source is cited in our documentation.",
                },
                {
                  q: "Why does Credex offer this for free?",
                  a: "Helping you find overspend surfaces real savings opportunities. Credex can help capture more of them through discounted AI credits sourced from companies that overforecast.",
                },
                {
                  q: "What tools do you support?",
                  a: "Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, Windsurf, and both Anthropic and OpenAI direct API usage.",
                },
              ].map((faq) => (
                <div key={faq.q}>
                  <h3 className="font-medium mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="py-20 px-4 bg-primary text-primary-foreground">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to find out what you are really spending?
            </h2>
            <p className="text-primary-foreground/80 mb-8 text-lg">
              Takes 2 minutes. No login. Completely free.
            </p>
            <Link href="/audit">
              <Button
                size="lg"
                variant="secondary"
                className="text-base px-8 h-12 cursor-pointer"
              >
                Start my free audit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
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
