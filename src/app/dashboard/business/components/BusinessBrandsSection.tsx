import { Edit, Image as ImageIcon, Palette, Plus, Trash2 } from "lucide-react";
import { getOptimizedImageUrl } from "@/lib/image-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ImageUpload from "@/components/ui/image-upload";
import type { BrandContent } from "../types";

interface BusinessBrandsSectionProps {
  sectionTitle: string;
  onSectionTitleChange: (value: string) => void;
  brandContent: BrandContent;
  savingBrand: boolean;
  onBrandNameChange: (value: string) => void;
  onBrandLogoChange: (value: string) => void;
  onBrandLogoUpload: (url: string) => void;
  onAddBrand: () => void;
  onEditBrand: (index: number) => void;
  onDeleteBrand: (index: number, name: string) => void;
}

export function BusinessBrandsSection({
  sectionTitle,
  onSectionTitleChange,
  brandContent,
  savingBrand,
  onBrandNameChange,
  onBrandLogoChange,
  onBrandLogoUpload,
  onAddBrand,
  onEditBrand,
  onDeleteBrand,
}: BusinessBrandsSectionProps) {
  return (
    <div className=" mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-900">Brand Slider</h1>
        <p className="text-md text-gray-600">Manage your brand slider</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-sm font-medium">Page Title for Brand Section</Label>
          <Input
            value={sectionTitle}
            onChange={(e) => onSectionTitleChange(e.target.value)}
            placeholder="Enter section title"
            className="rounded-2xl bg-white"
          />
        </div>

        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="text-lg">Add New Brand</CardTitle>
            <CardDescription>Add a new brand to your brand slider</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Brand Name</Label>
              <Input
                placeholder="Enter brand name"
                value={brandContent.newBrandName || ""}
                onChange={(e) => onBrandNameChange(e.target.value)}
                className="bg-white rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <Label>Brand Photo</Label>
              <div className="space-y-2">
                <Input
                  placeholder="Photo URL or upload below"
                  value={brandContent.newBrandLogo || ""}
                  onChange={(e) => onBrandLogoChange(e.target.value)}
                  className="bg-white rounded-2xl"
                />
                <ImageUpload onUpload={onBrandLogoUpload} />
              </div>
            </div>
            <Button
              onClick={onAddBrand}
              disabled={savingBrand}
              className="w-full rounded-2xl"
            >
              {savingBrand ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Brand
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="p-0 overflow-hidden rounded-xl">
          <CardContent className="p-0">
            {brandContent.brands?.length > 0 ? (
              <Table>
                <TableHeader className="bg-[#080322] ">
                  <TableRow>
                    <TableHead className="text-white font-medium">Brand Name</TableHead>
                    <TableHead className="text-white font-medium">Logo</TableHead>
                    <TableHead className="w-32 text-white font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brandContent.brands.map((brand, index) => (
                    <TableRow key={`${brand.name}-${index}`}>
                      <TableCell className="font-medium">{brand.name}</TableCell>
                      <TableCell>
                        {brand.logo ? (
                          <img
                            src={getOptimizedImageUrl(brand.logo, {
                              width: 32,
                              height: 32,
                              quality: 85,
                              format: "auto",
                            })}
                            alt={brand.name}
                            className="h-8 w-8 object-cover rounded-2xl"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-8 w-8 bg-gray-200 rounded-2xl flex items-center justify-center">
                            <ImageIcon className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEditBrand(index)}
                            className="rounded-xl"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDeleteBrand(index, brand.name)}
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
                <Palette className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No brands to manage</h3>
                <p className="text-gray-600">Add brands using the editor panel</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
