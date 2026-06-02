import { ExperienceLayout } from "@/components/layout/experience-layout";
import { AppHeader } from "@/components/layout/app-header";

export default function SoftwareEngineerLayout({
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
