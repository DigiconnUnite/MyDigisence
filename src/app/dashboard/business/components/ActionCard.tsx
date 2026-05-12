"use client";

import React from "react";
import { memo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ButtonVariant =
  | "link"
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | null
  | undefined;

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  buttonText: string;
  buttonAction: () => void;
  disabled?: boolean;
  variant?: ButtonVariant;
}

export default memo(function ActionCard({
  title,
  description,
  icon,
  buttonText,
  buttonAction,
  disabled = false,
  variant = "default",
}: ActionCardProps) {
  return (
    <Card className="rounded-3xl transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          variant={variant}
          onClick={buttonAction}
          disabled={disabled}
          className="rounded-xl"
        >
          {buttonText}
        </Button>
      </CardContent>
    </Card>
  );
});
