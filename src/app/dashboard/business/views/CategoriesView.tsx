"use client";

import React, { useState, useMemo } from "react";
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
import { Grid3X3, Plus, Search, Filter, Edit, Trash2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "../types";

interface CategoriesViewProps {
  categories: Category[];
  onAddCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
  onCategorySelect: (categoryId: string) => void;
  showCategoryDialog?: boolean;
  editingCategory?: Category | null;
  savingCategory?: boolean;
  categoryFormData?: {
    name: string;
    description: string;
    parentId: string;
  };
  onCloseCategoryDialog?: () => void;
  onSaveCategory?: () => void;
  onCategoryFormDataChange?: (data: Partial<{ name: string; description: string; parentId: string }>) => void;
}

export default function CategoriesView({
  categories,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onCategorySelect,
  showCategoryDialog = false,
  editingCategory = null,
  savingCategory = false,
  categoryFormData = { name: "", description: "", parentId: "" },
  onCloseCategoryDialog,
  onSaveCategory,
  onCategoryFormDataChange,
}: CategoriesViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredCategories = useMemo(() => {
    let filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (categoryFilter === "parent") {
      filtered = filtered.filter((category) => !category.parentId);
    } else if (categoryFilter === "sub") {
      filtered = filtered.filter((category) => category.parentId);
    }

    return filtered;
  }, [categories, searchTerm, categoryFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCategories(new Set(filteredCategories.map(c => c.id)));
    } else {
      setSelectedCategories(new Set());
    }
  };

  const handleSelectCategory = (categoryId: string, checked: boolean) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(categoryId);
      } else {
        newSet.delete(categoryId);
      }
      return newSet;
    });
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
          Categories Management
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Organize your products with categories and subcategories.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 w-full sm:w-auto">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-gray-300"
            />
          </div>

          {/* Filter */}
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px] rounded-xl border-gray-300">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({categories.length})</SelectItem>
              <SelectItem value="parent">
                Parent ({categories.filter((c) => !c.parentId).length})
              </SelectItem>
              <SelectItem value="sub">
                Sub ({categories.filter((c) => c.parentId).length})
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Add Category Button */}
        <Button
          onClick={onAddCategory}
          className="rounded-xl bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* Bulk Actions */}
      {selectedCategories.size > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedCategories.size} category(ies) selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategories(new Set())}
              >
                Clear Selection
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  // Bulk delete logic would go here
                  console.log("Bulk delete:", Array.from(selectedCategories));
                }}
              >
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 border-b border-gray-200">
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={filteredCategories.length > 0 && filteredCategories.every(c => selectedCategories.has(c.id))}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-14">SN.</TableHead>
                <TableHead>Category Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-4">
                      <Grid3X3 className="h-12 w-12 text-gray-400" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No categories found
                        </h3>
                        <p className="text-gray-600">
                          {searchTerm || categoryFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "Get started by adding your first category"}
                        </p>
                      </div>
                      {!searchTerm && categoryFilter === "all" && (
                        <Button
                          onClick={onAddCategory}
                          className="bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white rounded-xl hover:opacity-90 transition-opacity"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Category
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category, index) => {
                  const parentCategory = category.parentId
                    ? categories.find((c) => c.id === category.parentId)
                    : null;

                  return (
                    <TableRow
                      key={category.id}
                      className={`hover:bg-gray-50 cursor-pointer ${category.parentId ? "bg-gray-50/50" : ""}`}
                      onClick={() => onCategorySelect(category.id)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedCategories.has(category.id)}
                          onCheckedChange={(checked) => handleSelectCategory(category.id, !!checked)}
                        />
                      </TableCell>
                      <TableCell className="text-gray-500 font-medium">
                        {index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={category.parentId ? "text-sm" : "font-medium"}>
                            {category.name}
                          </span>
                          {category.parentId && (
                            <Badge variant="outline" className="text-xs bg-purple-50 border-purple-200 text-purple-700">
                              Sub
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 text-sm">
                        <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          {category.slug}
                        </code>
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
                          {category._count?.products || 0}
                        </Badge>
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditCategory(category)}
                          >
                            <Edit className="h-4 w-4 text-gray-500" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDeleteCategory(category)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
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

      {/* Category Dialog */}
      <Dialog open={showCategoryDialog} onOpenChange={onCloseCategoryDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? "Update the category details below."
                : "Create a new category for organizing your products."
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={categoryFormData.name}
                onChange={(e) => onCategoryFormDataChange?.({ name: e.target.value })}
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={categoryFormData.description}
                onChange={(e) => onCategoryFormDataChange?.({ description: e.target.value })}
                placeholder="Enter category description (optional)"
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="parentId">Parent Category</Label>
              <Select
                value={categoryFormData.parentId}
                onValueChange={(value) => onCategoryFormDataChange?.({ parentId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None (Parent Category)</SelectItem>
                  {categories
                    .filter(cat => cat.id !== editingCategory?.id && !cat.parentId)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onCloseCategoryDialog}
              disabled={savingCategory}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={onSaveCategory}
              disabled={savingCategory || !categoryFormData.name.trim()}
              className="bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white hover:opacity-90"
            >
              {savingCategory ? "Saving..." : editingCategory ? "Update Category" : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}