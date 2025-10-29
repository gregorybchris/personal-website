import { SmileyXEyes } from "@phosphor-icons/react";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
          <SmileyXEyes size={48} weight="duotone" color="#6283c0" />
          <div className="font-sanchez text-2xl text-black/75">
            Something went wrong
          </div>
          <div className="max-w-[600px] text-center text-black/60">
            {this.state.error?.message || "An unexpected error occurred"}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="rounded-md bg-blue-500/80 px-4 py-2 text-white transition-all hover:bg-blue-500"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
