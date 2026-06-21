"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500">
            <AlertTriangle className="h-7 w-7" />
          </div>
          <div className="space-y-2 max-w-md">
            <h2 className="font-[family-name:var(--font-plus-jakarta)] text-xl font-bold text-foreground">
              Something went wrong
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We encountered a runtime boundary error. Your progress has been saved locally, but we need to reload.
            </p>
            {this.state.error && (
              <pre className="mt-2 text-[10px] bg-muted p-3 rounded-lg border border-border text-left overflow-x-auto max-h-32 text-rose-400 font-mono">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <Button
            onClick={this.handleReset}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-5 py-2.5 font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-primary/10"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reload Application
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
