import { ExperienceLayout } from "@/components/layout/experience-layout";
import { AppHeader } from "@/components/layout/app-header";

export default function ScienceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ExperienceLayout>
      <AppHeader backHref="/explore" />
      {children}
    </ExperienceLayout>
  );
}
