import React from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { BulkActionsToolbar } from "@/components/ui/pagination";
import { Edit, FolderTree, Plus, SlidersHorizontal, Trash2 } from "lucide-react";
import AdminViewControls from "./AdminViewControls";
import AdminSectionHeader from "./AdminSectionHeader";
import AdminActionIconButton from "./AdminActionIconButton";
import AdminEmptyState from "./AdminEmptyState";
import type { Category } from "../types";

interface CategoriesViewProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onOpenAddCategory: () => void;
  selectedCategories: Set<string>;
  setSelectedCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
  safeCategories: Category[];
  filteredCategories: Category[];
  onInfoToast: (description: string) => void;
  handleEditCategory: (category: Category) => void;
  handleDeleteCategory: (category: Category) => void;
  categoryFilter: string;
  setCategoryFilter: React.Dispatch<React.SetStateAction<string>>;
}

export default function CategoriesView({
  searchTerm,
  setSearchTerm,
  onOpenAddCategory,
  selectedCategories,
  setSelectedCategories,
  safeCategories,
  filteredCategories,
  onInfoToast,
  handleEditCategory,
  handleDeleteCategory,
  categoryFilter,
  setCategoryFilter,
}: CategoriesViewProps) {
  const actualFilteredCategories = React.useMemo(() => {
    let filtered = filteredCategories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (categoryFilter === "parent") {
      filtered = filtered.filter((category) => !category.parentId);
    } else if (categoryFilter === "sub") {
      filtered = filtered.filter((category) => category.parentId);
    }

    return filtered;
  }, [filteredCategories, searchTerm, categoryFilter]);

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <AdminSectionHeader
        title="Manage Categories"
        description="Add, view, edit, and manage all business categories"
      />

      <AdminViewControls
        actions={
          <Button
            onClick={onOpenAddCategory}
            className="rounded-xl bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Add Category</span>
            <span className="sm:hidden">Add</span>
          </Button>
        }
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search categories..."
        filterContent={
          <Select
            value={categoryFilter}
            onValueChange={(value) => {
              setCategoryFilter(value);
            }}
          >
            <SelectTrigger className="rounded-none rounded-r-xl border-0 border-l border-gray-200 bg-transparent shadow-none hover:bg-gray-100 h-[42px] w-[42px] px-0 flex items-center justify-center cursor-pointer [&>svg]:hidden">
              <span className="flex items-center justify-center">
                <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({safeCategories.length})</SelectItem>
              <SelectItem value="parent">Parent Categories ({safeCategories.filter((c) => !c.parentId).length})</SelectItem>
              <SelectItem value="sub">Sub Categories ({safeCategories.filter((c) => c.parentId).length})</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {selectedCategories.size > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <BulkActionsToolbar
            selectedCount={selectedCategories.size}
            totalCount={safeCategories.length}
            onSelectAll={() => {
              const allIds = actualFilteredCategories.map((c) => c.id);
              setSelectedCategories(new Set(allIds));
            }}
            onDeselectAll={() => setSelectedCategories(new Set())}
            onBulkActivate={() => {
              onInfoToast("Bulk activate not applicable for categories");
            }}
            onBulkDeactivate={() => {
              onInfoToast("Bulk deactivate not applicable for categories");
            }}
            onBulkDelete={() => {
              onInfoToast(`Selected ${selectedCategories.size} categories`);
            }}
          />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 border-b border-gray-200">
              <TableRow>
                <TableHead className="w-12 text-gray-700 font-medium">
                  <Checkbox
                    checked={actualFilteredCategories.length > 0 && actualFilteredCategories.every((c) => selectedCategories.has(c.id))}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        const allIds = actualFilteredCategories.map((c) => c.id);
                        setSelectedCategories(new Set(allIds));
                      } else {
                        setSelectedCategories(new Set());
                      }
                    }}
                    className="border-gray-400"
                  />
                </TableHead>
                <TableHead className="w-14 text-gray-700 font-medium">SN.</TableHead>
                <TableHead className="text-gray-700 font-medium">Category Name</TableHead>
                <TableHead className="text-gray-700 font-medium">Slug</TableHead>
                <TableHead className="text-gray-700 font-medium">Parent Category</TableHead>
                <TableHead className="text-center text-gray-700 font-medium">Item Count</TableHead>
                <TableHead className="text-center text-gray-700 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {actualFilteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-12">
                    <AdminEmptyState
                      icon={<FolderTree className="h-8 w-8 text-gray-400" />}
                      title="No categories found"
                      description={
                        searchTerm || categoryFilter !== "all"
                          ? "Try adjusting your search or filters"
                          : "Get started by adding your first category"
                      }
                      action={
                        !searchTerm && categoryFilter === "all" ? (
                          <Button
                            onClick={onOpenAddCategory}
                            className="bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white rounded-xl hover:opacity-90 transition-opacity"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Category
                          </Button>
                        ) : undefined
                      }
                    />
                  </TableCell>
                </TableRow>
              ) : (
                actualFilteredCategories.map((category, index) => {
                  const parentCategory = category.parentId
                    ? safeCategories.find((c) => c.id === category.parentId)
                    : null;

                  return (
                    <TableRow
                      key={category.id}
                      className={`hover:bg-gray-50 ${category.parentId ? "bg-gray-50/50" : ""}`}
                    >
                      <TableCell>
                        <Checkbox
                          checked={selectedCategories.has(category.id)}
                          onCheckedChange={() => {
                            setSelectedCategories((prev) => {
                              const newSet = new Set(prev);
                              if (newSet.has(category.id)) {
                                newSet.delete(category.id);
                              } else {
                                newSet.add(category.id);
                              }
                              return newSet;
                            });
                          }}
                          className="border-gray-400"
                        />
                      </TableCell>
                      <TableCell className="text-gray-500 font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={category.parentId ? "text-sm" : "font-medium"}>{category.name}</span>
                          {category.parentId && (
                            <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                              Sub
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">
                        <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{category.slug}</code>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {parentCategory ? (
                          <span className="text-sm">{parentCategory.name}</span>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="secondary" className="rounded-full">
                          {category._count?.businesses || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-1">
                          <AdminActionIconButton
                            onClick={() => handleEditCategory(category)}
                            title="Edit Category"
                            rounded="md"
                          >
                            <Edit className="h-4 w-4 text-gray-500" />
                          </AdminActionIconButton>
                          <AdminActionIconButton
                            onClick={() => handleDeleteCategory(category)}
                            title="Delete Category"
                            tone="danger"
                            rounded="md"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </AdminActionIconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
