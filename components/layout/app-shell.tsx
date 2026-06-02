import { cn } from "@/lib/utils";

type AppShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function AppShell({ children, className }: AppShellProps) {
  return (
    <main className={cn("mx-auto min-h-screen w-full max-w-lg px-4 py-6 sm:px-5 sm:py-8", className)}>
      {children}
    </main>
  );
}
