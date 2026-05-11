"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, Crown, Zap, Building2, ArrowRight, CreditCard, Calendar, Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubscriptionViewProps {
  isLoading?: boolean;
}

const plans = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    description: "Basic features for getting started",
    features: [
      { text: "1 Service listing", included: true },
      { text: "3 Portfolio items", included: true },
      { text: "Basic profile", included: true },
      { text: "Email support", included: true },
      { text: "Custom domain", included: false },
      { text: "Priority support", included: false },
      { text: "Analytics", included: false },
      { text: "API access", included: false },
    ],
    cta: "Current Plan",
    popular: false,
  },
  {
    name: "Premium",
    price: 19,
    period: "month",
    description: "Everything you need to grow",
    features: [
      { text: "Unlimited services", included: true },
      { text: "Unlimited portfolio", included: true },
      { text: "Enhanced profile", included: true },
      { text: "Priority email support", included: true },
      { text: "Custom domain", included: true },
      { text: "Priority support", included: true },
      { text: "Basic analytics", included: true },
      { text: "API access", included: false },
    ],
    cta: "Upgrade Now",
    popular: true,
  },
  {
    name: "Business",
    price: 49,
    period: "month",
    description: "For power users and teams",
    features: [
      { text: "Unlimited services", included: true },
      { text: "Unlimited portfolio", included: true },
      { text: "Enhanced profile", included: true },
      { text: "24/7 phone & email support", included: true },
      { text: "Custom domain", included: true },
      { text: "Priority support", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Full API access", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const billingHistory = [
  { id: "INV-2024-001", date: "May 15, 2024", amount: 19.00, status: "Paid", description: "Premium Plan - Monthly" },
  { id: "INV-2024-002", date: "Apr 15, 2024", amount: 19.00, status: "Paid", description: "Premium Plan - Monthly" },
  { id: "INV-2024-003", date: "Mar 15, 2024", amount: 19.00, status: "Paid", description: "Premium Plan - Monthly" },
];

export default function SubscriptionView({ isLoading = false }: SubscriptionViewProps) {
  const currentPlan = plans[1]; // Premium

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-40 bg-gray-200 rounded-xl" />
        <div className="h-96 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Subscription & Plan</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your subscription and billing</p>
      </div>

      {/* Current Plan */}
      <Card className="p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5" />
              <span className="text-blue-100">Current Plan</span>
            </div>
            <h2 className="text-3xl font-bold">{currentPlan.name}</h2>
            <p className="text-blue-100 mt-1">{currentPlan.description}</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold">${currentPlan.price}</p>
            <p className="text-blue-100">/{currentPlan.period}</p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-white/20 flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-200" />
            <span className="text-sm">Next billing date: <strong>June 15, 2024</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-blue-200" />
            <span className="text-sm">Payment method: <strong>•••• 4242</strong></span>
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <Button variant="secondary" className="bg-white text-blue-600 hover:bg-white/90">
            Change Plan
          </Button>
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
            Cancel Subscription
          </Button>
        </div>
      </Card>

      {/* Plan Comparison */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Compare Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={cn(
                "p-6 relative",
                plan.popular && "border-2 border-blue-500 shadow-lg"
              )}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500">
                  <Zap className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1 mt-2">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">/{plan.period}</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {feature.included ? (
                      <Check className="h-5 w-5 text-green-500 shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 shrink-0" />
                    )}
                    <span className={cn(
                      "text-sm",
                      feature.included ? "text-gray-700" : "text-gray-400"
                    )}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Button 
                className={cn(
                  "w-full",
                  plan.popular 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : plan.cta === "Current Plan"
                    ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    : ""
                )}
                variant={plan.popular ? "default" : plan.cta === "Current Plan" ? "outline" : "default"}
                disabled={plan.cta === "Current Plan"}
              >
                {plan.cta}
                {plan.cta !== "Current Plan" && <ArrowRight className="h-4 w-4 ml-2" />}
              </Button>
            </Card>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Billing History</h2>
        <Card>
          <div className="divide-y">
            {billingHistory.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Download className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{invoice.description}</p>
                    <p className="text-sm text-gray-500">{invoice.id} • {invoice.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    {invoice.status}
                  </Badge>
                  <p className="font-medium text-gray-900">${invoice.amount.toFixed(2)}</p>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
