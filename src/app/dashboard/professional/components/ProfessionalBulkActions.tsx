"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreHorizontal,
  Trash2,
  Edit,
  Eye,
  Download,
  Archive,
  Power,
  CheckSquare,
  Square
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BulkActionsProps {
  selectedItems: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectItem: (id: string, checked: boolean) => void;
  onBulkAction: (action: string, selectedIds: string[]) => void;
  totalCount: number;
  actions: {
    label: string;
    icon: React.ReactNode;
    action: string;
    disabled?: boolean;
  }[];
  loading?: boolean;
}

export function ProfessionalBulkActions({
  selectedItems,
  onSelectAll,
  onSelectItem,
  onBulkAction,
  totalCount,
  actions,
  loading = false
}: BulkActionsProps) {
  const isAllSelected = selectedItems.length === totalCount && totalCount > 0;
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < totalCount;

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
      <div className="flex items-center gap-4">
        <Checkbox
          checked={isAllSelected}
          ref={isPartiallySelected ? undefined : undefined}
          className={cn(isPartiallySelected && "data-[state=checked]:bg-gray-300")}
          onCheckedChange={onSelectAll}
        />
        <span className="text-sm text-gray-600">
          {selectedItems.length > 0 
            ? `${selectedItems.length} of ${totalCount} selected`
            : `${totalCount} items`
          }
        </span>
      </div>

      {selectedItems.length > 0 && (
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={loading}>
                <CheckSquare className="h-4 w-4 mr-2" />
                Bulk Actions
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions.map((action, index) => (
                <DropdownMenuItem
                  key={action.action}
                  onClick={() => onBulkAction(action.action, selectedItems)}
                  disabled={action.disabled || loading}
                  className={cn(action.disabled && "text-gray-400 cursor-not-allowed")}
                >
                  {action.icon}
                  <span className="ml-2">{action.label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectAll(false)}
            disabled={loading}
          >
            Clear Selection
          </Button>
        </div>
      )}
    </div>
  );
}

interface EnhancedTableProps {
  data: any[];
  columns: {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
  }[];
  actions?: {
    label: string;
    icon: React.ReactNode;
    onClick: (row: any) => void;
    disabled?: (row: any) => boolean;
  }[];
  selectedItems: string[];
  onSelectItem: (id: string, checked: boolean) => void;
  loading?: boolean;
  emptyMessage?: string;
  idField?: string;
}

export function EnhancedProfessionalTable({
  data,
  columns,
  actions,
  selectedItems,
  onSelectItem,
  loading = false,
  emptyMessage = "No data available",
  idField = "id"
}: EnhancedTableProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedItems.length === data.length && data.length > 0}
                onCheckedChange={(checked) => {
                  if (typeof checked === 'boolean') {
                    data.forEach(row => onSelectItem(row[idField], checked));
                  }
                }}
              />
            </TableHead>
            {columns.map((column) => (
              <TableHead key={column.key} className="text-sm font-medium text-gray-700">
                {column.label}
              </TableHead>
            ))}
            {actions && (
              <TableHead className="text-right text-sm font-medium text-gray-700">
                Actions
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            [...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                </TableCell>
                {columns.map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                ))}
                {actions && (
                  <TableCell>
                    <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length + (actions ? 2 : 1)} className="text-center py-8">
                <p className="text-gray-500">{emptyMessage}</p>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow
                key={row[idField]}
                className={cn(
                  "border-b border-gray-100 hover:bg-gray-50 transition-colors",
                  selectedItems.includes(row[idField]) && "bg-blue-50"
                )}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedItems.includes(row[idField])}
                    onCheckedChange={(checked) => {
                      if (typeof checked === 'boolean') {
                        onSelectItem(row[idField], checked);
                      }
                    }}
                  />
                </TableCell>
                {columns.map((column) => (
                  <TableCell key={column.key} className="text-sm">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {actions.map((action, actionIndex) => (
                          <DropdownMenuItem
                            key={actionIndex}
                            onClick={() => action.onClick(row)}
                            disabled={action.disabled?.(row)}
                            className={cn(
                              action.disabled?.(row) && "text-gray-400 cursor-not-allowed"
                            )}
                          >
                            {action.icon}
                            <span className="ml-2">{action.label}</span>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

interface AdvancedFiltersProps {
  filters: {
    key: string;
    label: string;
    options: { value: string; label: string }[];
    value?: string;
  }[];
  onFilterChange: (key: string, value: string) => void;
  onReset: () => void;
  activeFiltersCount: number;
}

export function AdvancedFilters({
  filters,
  onFilterChange,
  onReset,
  activeFiltersCount
}: AdvancedFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 border-b">
      {filters.map((filter) => (
        <div key={filter.key} className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">{filter.label}:</span>
          <select
            value={filter.value || ""}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="">All</option>
            {filter.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
      
      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="ml-auto"
        >
          Reset Filters ({activeFiltersCount})
        </Button>
      )}
    </div>
  );
}

export default ProfessionalBulkActions;
