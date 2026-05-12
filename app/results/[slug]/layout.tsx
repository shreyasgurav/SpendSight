import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://spendsight.vercel.app";

  return {
    title: "Your AI Spend Audit — SpendSight",
    description:
      "See how much your team could save on AI tools like Cursor, Claude, ChatGPT, and Copilot. Free instant audit by SpendSight.",
    openGraph: {
      title: "I just audited my AI tool spend — SpendSight",
      description:
        "Find out how much your startup is overspending on AI tools. Free audit, no login required.",
      url: `${appUrl}/results/${slug}`,
      type: "website",
      siteName: "SpendSight by Credex",
    },
    twitter: {
      card: "summary_large_image",
      title: "I just audited my AI tool spend — SpendSight",
      description:
        "Find out how much your startup is overspending on AI tools. Free audit, no login required.",
    },
  };
}

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
