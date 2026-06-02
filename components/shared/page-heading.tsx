import { cn } from "@/lib/utils";

type PageHeadingProps = {
  title: string;
  className?: string;
};

export function PageHeading({ title, className }: PageHeadingProps) {
  return (
    <h1
      className={cn(
        "font-[family-name:var(--font-plus-jakarta)] text-2xl font-semibold tracking-tight",
        className,
      )}
    >
      {title}
    </h1>
  );
}
