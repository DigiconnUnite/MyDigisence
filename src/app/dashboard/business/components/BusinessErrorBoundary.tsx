"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, RefreshCw } from "lucide-react";

interface BusinessErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface BusinessErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class BusinessErrorBoundary extends Component<
  BusinessErrorBoundaryProps,
  BusinessErrorBoundaryState
> {
  constructor(props: BusinessErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): BusinessErrorBoundaryState {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-4">
          <Card className="max-w-md w-full rounded-3xl">
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-6 w-6 text-red-500" />
                <CardTitle className="text-red-900">Something went wrong</CardTitle>
              </div>
              <CardDescription>
                An error occurred while loading the business dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Error Details:
                </p>
                <p className="text-sm text-gray-600 font-mono">
                  {this.state.error?.message || "Unknown error"}
                </p>
              </div>
              <Button
                onClick={this.handleReset}
                className="w-full rounded-xl"
                variant="default"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
