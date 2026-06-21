export function ExploreLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-background p-6 space-y-6 dark">
      {/* Top Header Row Skeleton */}
      <div className="flex items-center justify-between border-b border-border/60 pb-5">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-muted rounded-lg animate-pulse" />
          <div className="h-4 w-72 bg-muted/60 rounded animate-pulse" />
        </div>
        <div className="h-10 w-28 bg-muted rounded-xl animate-pulse" />
      </div>

      {/* Grid Content Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side Wide Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="h-60 bg-muted/40 border border-border/40 rounded-3xl p-6 space-y-4 animate-pulse">
            <div className="h-5 w-1/3 bg-muted rounded-lg" />
            <div className="h-24 bg-muted/60 rounded-xl" />
            <div className="h-8 w-24 bg-muted rounded-lg" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="h-48 bg-muted/40 border border-border/40 rounded-3xl p-6 space-y-4 animate-pulse">
              <div className="h-5 w-1/2 bg-muted rounded-lg" />
              <div className="h-16 bg-muted/60 rounded-xl" />
            </div>
            <div className="h-48 bg-muted/40 border border-border/40 rounded-3xl p-6 space-y-4 animate-pulse">
              <div className="h-5 w-1/2 bg-muted rounded-lg" />
              <div className="h-16 bg-muted/60 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Right Side Column Card */}
        <div className="space-y-6">
          <div className="h-96 bg-muted/40 border border-border/40 rounded-3xl p-6 space-y-4 animate-pulse">
            <div className="h-5 w-1/2 bg-muted rounded-lg" />
            <div className="h-4 bg-muted/60 rounded-md" />
            <div className="h-4 bg-muted/60 rounded-md" />
            <div className="h-24 bg-muted/80 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
