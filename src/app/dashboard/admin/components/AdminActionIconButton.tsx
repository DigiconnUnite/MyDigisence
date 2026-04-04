import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface AdminActionIconButtonProps {
  title: string;
  onClick: () => void;
  children: ReactNode;
  tone?: "neutral" | "danger";
  rounded?: "md" | "lg";
}

export default function AdminActionIconButton({
  title,
  onClick,
  children,
  tone = "neutral",
  rounded = "lg",
}: AdminActionIconButtonProps) {
  const roundedClass = rounded === "md" ? "rounded-md" : "rounded-lg";
  const hoverClass = tone === "danger" ? "hover:bg-red-50" : "hover:bg-gray-100";

  return (
    <Button
      size="sm"
      variant="ghost"
      className={`h-8 w-8 p-0 ${roundedClass} ${hoverClass}`}
      onClick={onClick}
      title={title}
    >
      {children}
    </Button>
  );
}