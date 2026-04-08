import { Edit, Grid3X3, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Category, CategoryFormData } from "../types";

interface BusinessCategoriesSectionProps {
  sectionTitle: string;
  onSectionTitleChange: (value: string) => void;
  categoryFormData: CategoryFormData;
  onCategoryFormChange: (data: CategoryFormData) => void;
  categories: Category[];
  savingCategory: boolean;
  onCreateCategory: () => void;
  onEditCategory: (category: Category) => void;
  onDeleteCategory: (category: Category) => void;
}

export function BusinessCategoriesSection({
  sectionTitle,
  onSectionTitleChange,
  categoryFormData,
  onCategoryFormChange,
  categories,
  savingCategory,
  onCreateCategory,
  onEditCategory,
  onDeleteCategory,
}: BusinessCategoriesSectionProps) {
  return (
    <div className=" mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-900">Category Manager</h1>
        <p className="text-md text-gray-600">Configure business categories and classifications</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium mb-1">Section Title</Label>
          <Input
            value={sectionTitle}
            onChange={(e) => onSectionTitleChange(e.target.value)}
            placeholder="Enter section title"
            className="bg-white rounded-2xl"
          />
        </div>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg">Add New Category</CardTitle>
            <CardDescription>Add a new category for your products</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Category Name *</Label>
              <Input
                placeholder="Enter category name"
                value={categoryFormData.name}
                onChange={(e) =>
                  onCategoryFormChange({
                    ...categoryFormData,
                    name: e.target.value,
                  })
                }
                className="bg-white rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe this category"
                value={categoryFormData.description}
                onChange={(e) =>
                  onCategoryFormChange({
                    ...categoryFormData,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="bg-white rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Parent Category</Label>
              <Select
                value={categoryFormData.parentId || "none"}
                onValueChange={(value) =>
                  onCategoryFormChange({
                    ...categoryFormData,
                    parentId: value === "none" ? "" : value,
                  })
                }
              >
                <SelectTrigger className="bg-white rounded-2xl">
                  <SelectValue placeholder="Select parent category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No parent</SelectItem>
                  {categories
                    .filter((cat) => !cat.parentId)
                    .map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button
                variant="default"
                onClick={onCreateCategory}
                disabled={savingCategory}
                className="rounded-xl  hover:opacity-90 transition-opacity"
              >
                {savingCategory ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  "Add New Category"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className=" p-0 rounded-xl overflow-hidden">
          <CardContent className="p-0">
            {categories.length > 0 ? (
              <Table>
                <TableHeader className="bg-[#080322] ">
                  <TableRow>
                    <TableHead className="text-white font-medium">Category Name</TableHead>
                    <TableHead className="text-white font-medium">Description</TableHead>
                    <TableHead className="text-white font-medium">Parent</TableHead>
                    <TableHead className="w-32 text-white font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description || "—"}</TableCell>
                      <TableCell>{category.parent ? category.parent.name : "—"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEditCategory(category)}
                            className="rounded-xl"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDeleteCategory(category)}
                            className="rounded-xl"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8">
                <Grid3X3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
                <p className="text-gray-600">Add your first category using the form above</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
