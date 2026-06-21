"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ReadinessRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/explore/dashboard");
  }, [router]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
