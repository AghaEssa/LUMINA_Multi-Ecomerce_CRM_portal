"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { logger } from "@/lib/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  widgetName?: string;
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

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logger.error(`UI Error Boundary caught an unhandled component exception in [${this.props.widgetName || "Widget"}]`, error, {
      componentStack: errorInfo.componentStack,
      widgetName: this.props.widgetName,
    });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="rounded-3xl border border-rose-200/80 bg-rose-50/50 dark:border-rose-950/60 dark:bg-rose-950/20 p-6 text-center shadow-sm">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 font-bold text-xl">
            ⚠️
          </div>
          <h4 className="mt-3 text-sm font-extrabold text-slate-900 dark:text-white">
            {this.props.widgetName || "Widget"} Temporarily Unavailable
          </h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            This component encountered a temporary error. The rest of the page remains fully functional.
          </p>
          <button
            onClick={this.handleReset}
            className="mt-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 text-xs font-bold shadow-sm transition active:scale-95"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
