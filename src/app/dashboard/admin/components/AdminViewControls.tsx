import React, { ReactNode } from "react";
import AdminSearchBar from "./AdminSearchBar";

interface AdminViewControlsProps {
  actions?: ReactNode;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
}

export default function AdminViewControls({
  actions,
  searchValue,
  onSearchChange,
  searchPlaceholder,
}: AdminViewControlsProps) {
  return (
    <div className="space-y-3">
      {actions ? <div className="flex gap-2">{actions}</div> : null}
      <AdminSearchBar
        value={searchValue}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
      />
    </div>
  );
}
