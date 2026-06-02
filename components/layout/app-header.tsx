import Link from "next/link";
import { cn } from "@/lib/utils";

type AppHeaderProps = {
  backHref?: string;
  className?: string;
};

export function AppHeader({ backHref, className }: AppHeaderProps) {
  return (
    <header className={cn("mb-6 flex items-center gap-3", className)}>
      {backHref ? (
        <Link href={backHref} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </Link>
      ) : (
        <span className="font-[family-name:var(--font-plus-jakarta)] text-sm font-semibold">
          CareerVerse
        </span>
      )}
    </header>
  );
}
