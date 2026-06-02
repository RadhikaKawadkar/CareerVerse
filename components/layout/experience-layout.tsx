import { cn } from "@/lib/utils";

type ExperienceLayoutProps = {
  children: React.ReactNode;
  className?: string;
};

export function ExperienceLayout({ children, className }: ExperienceLayoutProps) {
  return (
    <div className={cn("flex min-h-screen flex-col", className)}>
      <div className="mx-auto w-full max-w-lg flex-1 px-5 py-8">{children}</div>
    </div>
  );
}
