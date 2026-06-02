import { AppShell } from "@/components/layout/app-shell";
import { AppHeader } from "@/components/layout/app-header";
import { ResultsInsight } from "@/components/results/results-insight";

export default function ResultsPage() {
  return (
    <AppShell>
      <AppHeader backHref="/explore" />
      <ResultsInsight />
    </AppShell>
  );
}
