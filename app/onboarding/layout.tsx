import { AppShell } from "@/components/layout/app-shell";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppShell className="pb-8">{children}</AppShell>;
}
