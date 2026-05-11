import React, { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";

interface AdminSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  filterContent?: ReactNode;
}

export default function AdminSearchBar({
  value,
  onChange,
  placeholder,
  filterContent,
}: AdminSearchBarProps) {
  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
      <Input
        placeholder={placeholder}
        className="pl-10 pr-12 w-full rounded-xl border-gray-200 bg-white shadow-none focus-visible:ring-gray-300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {filterContent ? (
        <div className="absolute right-0">
          {filterContent}
        </div>
      ) : (
        <Button
          type="button"
          variant="ghost"
          className="rounded-none rounded-r-xl border-0 border-l border-gray-500 bg-transparent shadow-none hover:bg-transparent h-[42px] px-3 pointer-events-none"
          disabled
        >
          <SlidersHorizontal className="h-4 w-4 text-gray-700" />
        </Button>
      )}
    </div>
  );
}