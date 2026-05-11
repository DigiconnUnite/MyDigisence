"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, Upload, Plus, X, Wrench, DollarSign, FileText, 
  Layers, CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceFormViewProps {
  service?: any;
  isEditing?: boolean;
  isLoading?: boolean;
  onSave?: (data: any) => void;
  onCancel?: () => void;
}

export default function ServiceFormView({
  service,
  isEditing = false,
  isLoading = false,
  onSave,
  onCancel,
}: ServiceFormViewProps) {
  const [formData, setFormData] = useState({
    name: service?.name || "",
    category: service?.category || "",
    shortDescription: service?.shortDescription || "",
    fullDescription: service?.fullDescription || "",
    price: service?.price || "",
    currency: service?.currency || "USD",
    isActive: service?.isActive ?? true,
    features: service?.features || [""],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["Development", "Design", "Marketing", "Consulting", "Maintenance", "Other"];

  const addFeature = () => {
    setFormData(prev => ({ ...prev, features: [...prev.features, ""] }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_: string, i: number) => i !== index)
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((f: string, i: number) => i === index ? value : f)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave?.(formData);
    setIsSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-64 bg-gray-200 rounded" />
        <div className="h-96 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Service" : "Add New Service"}
          </h1>
          <p className="text-sm text-gray-500">
            {isEditing ? "Update your service details" : "Create a new service offering"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Wrench className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Service Information</h2>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Service Name</Label>
                    <Input
                      placeholder="e.g., Web Development"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Short Description</Label>
                  <Input
                    placeholder="Brief description (shown in listings)"
                    value={formData.shortDescription}
                    onChange={e => setFormData({ ...formData, shortDescription: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Full Description</Label>
                  <Textarea
                    placeholder="Detailed description of your service..."
                    value={formData.fullDescription}
                    onChange={e => setFormData({ ...formData, fullDescription: e.target.value })}
                    rows={5}
                    required
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Layers className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold">Service Features</h2>
              </div>

              <div className="space-y-3">
                {formData.features.map((feature: string, index: number) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Feature ${index + 1}`}
                      value={feature}
                      onChange={e => updateFeature(index, e.target.value)}
                    />
                    {formData.features.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFeature(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addFeature}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column - Pricing & Settings */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold">Pricing</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Price</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <Input
                      type="number"
                      className="pl-7"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Currency</Label>
                  <select
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                    value={formData.currency}
                    onChange={e => setFormData({ ...formData, currency: e.target.value })}
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <FileText className="h-5 w-5 text-orange-600" />
                <h2 className="text-lg font-semibold">Service Image</h2>
              </div>

              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Service Status</Label>
                  <p className="text-sm text-gray-500">
                    {formData.isActive ? "Active and visible" : "Inactive and hidden"}
                  </p>
                </div>
                <Switch
                  checked={formData.isActive}
                  onCheckedChange={(checked: boolean) => setFormData({ ...formData, isActive: checked })}
                />
              </div>
            </Card>

            <div className="flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Saving..."
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {isEditing ? "Update" : "Publish"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
