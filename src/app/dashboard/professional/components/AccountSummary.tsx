"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, CreditCard, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountSummaryProps {
  memberSince?: string;
  plan?: string;
  status?: "active" | "inactive" | "pending";
  nextBillingDate?: string;
  isLoading?: boolean;
  onManageSubscription?: () => void;
}

const planConfig = {
  active: { label: "Active", className: "bg-green-100 text-green-700" },
  inactive: { label: "Inactive", className: "bg-gray-100 text-gray-600" },
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700" },
};

export default function AccountSummary({
  memberSince = "Jan 15, 2025",
  plan = "Premium Plan",
  status = "active",
  nextBillingDate = "Jun 15, 2025",
  isLoading = false,
  onManageSubscription,
}: AccountSummaryProps) {
  const statusInfo = planConfig[status];

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="h-5 w-32 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-32 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <div className="mt-4 h-10 bg-gray-200 rounded" />
      </Card>
    );
  }

  const items = [
    { label: "Member Since", value: memberSince, icon: Calendar },
    { label: "Plan", value: plan, icon: CreditCard },
    { label: "Profile Status", value: statusInfo.label, icon: CheckCircle2, isStatus: true },
    { label: "Next Billing Date", value: nextBillingDate, icon: Calendar },
  ];

  return (
    <Card className="p-6 bg-white border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>

      <div className="space-y-3">
        {items.map((item, index) => {
          const Icon = item.icon;
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-500">
                <Icon className="h-4 w-4" />
                <span className="text-sm">{item.label}</span>
              </div>
              {item.isStatus ? (
                <span
                  className={cn(
                    "text-xs font-medium px-2 py-0.5 rounded-full",
                    statusInfo.className
                  )}
                >
                  {item.value}
                </span>
              ) : (
                <span className="text-sm font-medium text-gray-900">{item.value}</span>
              )}
            </div>
          );
        })}
      </div>

      <Button
        variant="outline"
        className="w-full mt-6 border-blue-300 text-blue-600 hover:bg-blue-50"
        onClick={onManageSubscription}
      >
        <CreditCard className="h-4 w-4 mr-2" />
        Manage Subscription
      </Button>
    </Card>
  );
}
