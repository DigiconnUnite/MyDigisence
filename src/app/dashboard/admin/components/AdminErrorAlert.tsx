import React from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface AdminErrorAlertProps {
  message: string;
  onRetry?: () => void;
  title?: string;
}

export default function AdminErrorAlert({
  message,
  onRetry,
  title = "Data Fetching Error",
}: AdminErrorAlertProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <span className="text-red-600 font-medium">{title}</span>
        </div>
        {onRetry && (
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={onRetry} className="rounded-xl">
              Retry
            </Button>
          </div>
        )}
      </div>
      <p className="text-red-600 text-sm mt-1">{message}</p>
    </div>
  );
}