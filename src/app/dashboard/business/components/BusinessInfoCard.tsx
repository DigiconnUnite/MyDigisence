import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Save,
  Loader2,
  User,
  FileText,
  Clock,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  X,
  Plus,
  Hash,
  XCircle,
  FileUp,
  FileIcon,
  Download,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import ImageCropUpload from "@/components/ui/image-crop-upload";
import { useToast } from "@/hooks/use-toast";

interface BusinessInfoCardProps {
  businessName: string;
  adminName: string;
  description: string;
  logoUrl?: string;
  onEdit?: () => void;
  onLogoUpload?: (url: string) => void;
  gstNumber?: string;
  openingHours?: { day: string; open: string; close: string; closed?: boolean }[];
  address?: string;
  mobile?: string;
  email?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  catalogPdf?: string | null;
}

export const BusinessInfoCard: React.FC<BusinessInfoCardProps> = ({
  businessName,
  adminName,
  description,
  logoUrl,
  onEdit,
  onLogoUpload,
  gstNumber,
  openingHours,
  address,
  mobile,
  email,
  socialLinks,
  catalogPdf,
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [isEditingLegal, setIsEditingLegal] = useState(false);
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isEditingSocial, setIsEditingSocial] = useState(false);

  const [editData, setEditData] = useState({
    businessName,
    adminName,
    description,
    logo: logoUrl || "",
    logoPendingSave: false,
    gstNumber: gstNumber || "",
    openingHours: openingHours || [
      { day: "Monday", open: "09:00", close: "18:00", closed: false },
      { day: "Tuesday", open: "09:00", close: "18:00", closed: false },
      { day: "Wednesday", open: "09:00", close: "18:00", closed: false },
      { day: "Thursday", open: "09:00", close: "18:00", closed: false },
      { day: "Friday", open: "09:00", close: "18:00", closed: false },
      { day: "Saturday", open: "09:00", close: "18:00", closed: false },
      { day: "Sunday", open: "", close: "", closed: true },
    ],
    address: address || "",
    mobile: mobile || "",
    email: email || "",
    facebook: socialLinks?.facebook || "",
    twitter: socialLinks?.twitter || "",
    instagram: socialLinks?.instagram || "",
    linkedin: socialLinks?.linkedin || "",
    catalogPdf: catalogPdf || "",
    catalogPdfPendingSave: false,
  });

  // Sync state when props change (e.g. after a full page load)
  React.useEffect(() => {
    if (logoUrl && logoUrl !== editData.logo) {
      setEditData((prev) => ({ ...prev, logo: logoUrl }));
    }
  }, [logoUrl]);

  const [isSaving, setIsSaving] = useState(false);
  const [selectedPdfFile, setSelectedPdfFile] = useState<File | null>(null);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);

  // Handler for logo upload from ImageCropUpload component
  const handleLogoUpload = useCallback((url: string) => {
    setEditData((prev) => ({
      ...prev,
      logo: url,
      logoPendingSave: true,
    }));
    if (onLogoUpload) onLogoUpload(url);
    toast({
      title: "Success",
      description: "Logo uploaded successfully. Click Save to apply changes.",
    });
  }, [onLogoUpload, toast]);

  const handleEditClick = () => {
    if (onEdit) onEdit();
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    // Validation logic
    if (!editData.businessName.trim()) {
      toast({
        title: "Validation Error",
        description: "Business name is required",
        variant: "destructive",
      });
      return;
    }

    if (editData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      toast({
        title: "Validation Error",
        description: "Invalid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/business", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editData.businessName,
          description: editData.description,
          ownerName: editData.adminName,
          gstNumber: editData.gstNumber,
          openingHours: editData.openingHours,
          address: editData.address,
          mobile: editData.mobile,
          email: editData.email,
          facebook: editData.facebook,
          twitter: editData.twitter,
          instagram: editData.instagram,
          linkedin: editData.linkedin,
          ...(editData.logoPendingSave && { logoUrl: editData.logo }),
          ...(editData.catalogPdfPendingSave && { catalogPdf: editData.catalogPdf }),
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Update local state from server response
        setEditData((prev) => ({
          ...prev,
          businessName: responseData.business.name || prev.businessName,
          logo: responseData.business.logo || prev.logo, // Sync logo from DB
          logoPendingSave: false, // Reset pending save flag
          catalogPdfPendingSave: false,
          adminName: responseData.business.admin?.name || prev.adminName,
          description: responseData.business.description || prev.description,
          // ... update other fields as needed
        }));

        // Reset editing states
        setIsEditing(false);
        setIsEditingAbout(false);
        setIsEditingLegal(false);
        setIsEditingContact(false);
        setIsEditingSocial(false);
        if (onEdit) onEdit();
        toast({
          title: "Success",
          description: "Business information saved successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: responseData.error || "Failed to save changes",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving business info:", error);
      toast({
        title: "Error",
        description: "An error occurred while saving changes.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePdfFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        if (file.type === "application/pdf") {
          setSelectedPdfFile(file);
          uploadPdf(file);
        } else {
          toast({
            title: "Invalid File Type",
            description: "Please select a PDF file",
            variant: "destructive",
          });
        }
      }
    },
    [toast],
  );

  const uploadPdf = async (file: File) => {
    setIsUploadingPdf(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "catalog");

      const uploadResponse = await fetch("/api/business/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const uploadData = await uploadResponse.json();
      const permanentUrl = uploadData.url;

      if (!permanentUrl) throw new Error("No URL returned from upload server");

      setEditData((prev) => ({
        ...prev,
        catalogPdf: permanentUrl,
        catalogPdfPendingSave: true,
      }));

      toast({
        title: "Success",
        description: "Catalog PDF uploaded successfully. Click Save to apply changes.",
      });
    } catch (error) {
      console.error("Error uploading PDF:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload PDF.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingPdf(false);
      setSelectedPdfFile(null);
    }
  };

  const removeCatalogPdf = () => {
    setEditData((prev) => ({
      ...prev,
      catalogPdf: "",
      catalogPdfPendingSave: true,
    }));
  };

  return (
    <div className="w-full p-0 mx-auto border-none shadow-none bg-transparent">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* --- Profile Information Card --- */}
        <div className="md:col-span-2 bg-gray-50 rounded-2xl p-6 border border-gray-200 relative">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Profile Information
            </h3>
            {isEditing ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setIsEditing(false)}
                >
                  <XCircle className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-3"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleEditClick}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
            {/* Column 1: Profile Picture - Using ImageCropUpload with avatar variant */}
            <div className="md:col-span-1 flex justify-center md:justify-start">
              <ImageCropUpload
                onUpload={handleLogoUpload}
                onError={(error) => {
                  toast({
                    title: "Error",
                    description: error,
                    variant: "destructive",
                  });
                }}
                aspectRatio={1}
                mode="crop"
                variant="avatar"
                currentImageUrl={editData.logo}
                placeholder={editData.businessName}
                uploadType="logo"
                disabled={!isEditing}
                className="shrink-0"
              />
            </div>

            {/* Column 2: Business Name & Admin Name */}
            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Business Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={editData.businessName}
                    disabled={true}
                    className={`w-full text-lg font-semibold border rounded-md pl-9 pr-3 py-2 outline-none transition-colors bg-gray-100 border-gray-200 text-gray-600`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Admin Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={editData.adminName}
                    onChange={(e) =>
                      setEditData({ ...editData, adminName: e.target.value })
                    }
                    disabled={!isEditing}
                    className={`w-full text-sm font-medium text-gray-700 border rounded-md pl-9 pr-3 py-2 outline-none transition-colors ${isEditing ? "bg-white border-gray-300 text-gray-900 focus:border-gray-500" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                  />
                </div>
              </div>
            </div>

            {/* Column 3: Catalog PDF Upload */}
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Catalog PDF
              </label>
              {editData.catalogPdf ? (
                <div className="flex items-center gap-3 p-3 border rounded-md bg-white">
                  <div className="flex items-center gap-2 flex-1">
                    <FileIcon className="h-5 w-5 text-red-500" />
                    <span className="text-sm text-gray-700 truncate max-w-[150px]">
                      Catalog.pdf
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {editData.catalogPdf && (
                      <a
                        href={editData.catalogPdf}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    )}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={removeCatalogPdf}
                        className="p-1.5 rounded-md hover:bg-red-50 text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-gray-400 transition-colors">
                  <input
                    id="catalog-pdf-upload"
                    type="file"
                    accept="application/pdf"
                    onChange={handlePdfFileSelect}
                    className="hidden"
                    disabled={!isEditing || isUploadingPdf}
                  />
                  <label
                    htmlFor="catalog-pdf-upload"
                    className={`cursor-pointer flex flex-col items-center justify-center ${!isEditing ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    {isUploadingPdf ? (
                      <>
                        <Loader2 className="h-6 w-6 text-gray-400 animate-spin mb-2" />
                        <span className="text-sm text-gray-500">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <FileUp className="h-6 w-6 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">
                          Click to upload PDF
                        </span>
                      </>
                    )}
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- About Section Card --- */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 flex flex-col h-full">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-400" />
              <h3 className="text-base font-semibold text-gray-900">About</h3>
            </div>
            {isEditingAbout ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setIsEditingAbout(false)}
                >
                  <XCircle className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-3"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsEditingAbout(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="relative flex-1">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FileText className="h-4 w-4 text-gray-400" />
            </div>
            <textarea
              value={editData.description}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              disabled={!isEditingAbout}
              className={`flex-1 w-full resize-none border rounded-md p-3 pl-9 text-sm leading-relaxed outline-none transition-colors min-h-[120px] ${isEditingAbout ? "bg-white border-gray-300 text-gray-900 focus:border-gray-500" : "bg-gray-50 border-gray-200 text-gray-600"}`}
            />
          </div>
        </div>

        {/* --- Legal Info Card --- */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Hash className="h-5 w-5 text-gray-400" />
              <h3 className="text-base font-semibold text-gray-900">
                Legal Info
              </h3>
            </div>
            {isEditingLegal ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setIsEditingLegal(false)}
                >
                  <XCircle className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-3"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsEditingLegal(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                GST Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Hash className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={editData.gstNumber}
                  onChange={(e) =>
                    setEditData({ ...editData, gstNumber: e.target.value })
                  }
                  placeholder="Enter GST Number"
                  disabled={!isEditingLegal}
                  className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm outline-none transition-colors ${isEditingLegal ? "bg-white border-gray-300 text-gray-900 focus:border-gray-500" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                />
              </div>
            </div>
            <div className="space-y-4">
              {editData.openingHours.map((hour, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Day
                    </label>
                    <Select
                      value={hour.day}
                      onValueChange={(value) => {
                        const newHours = [...editData.openingHours];
                        newHours[index].day = value;
                        setEditData({ ...editData, openingHours: newHours });
                      }}
                      disabled={!isEditingLegal}
                    >
                      <SelectTrigger className={isEditingLegal ? "bg-white border-gray-300" : "bg-gray-50 border-gray-200"}>
                        <SelectValue placeholder="Select day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                        <SelectItem value="Sunday">Sunday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Opening Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Clock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        value={hour.open}
                        onChange={(e) => {
                          const newHours = [...editData.openingHours];
                          newHours[index].open = e.target.value;
                          setEditData({ ...editData, openingHours: newHours });
                        }}
                        disabled={!isEditingLegal || hour.closed}
                        className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm outline-none transition-colors ${isEditingLegal && !hour.closed ? "bg-white border-gray-300 text-gray-900 focus:border-gray-500" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Closing Time
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Clock className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="time"
                        value={hour.close}
                        onChange={(e) => {
                          const newHours = [...editData.openingHours];
                          newHours[index].close = e.target.value;
                          setEditData({ ...editData, openingHours: newHours });
                        }}
                        disabled={!isEditingLegal || hour.closed}
                        className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm outline-none transition-colors ${isEditingLegal && !hour.closed ? "bg-white border-gray-300 text-gray-900 focus:border-gray-500" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pb-2">
                    <Checkbox
                      id={`closed-${index}`}
                      checked={hour.closed}
                      onCheckedChange={(checked) => {
                        const newHours = [...editData.openingHours];
                        newHours[index].closed = checked === true;
                        setEditData({ ...editData, openingHours: newHours });
                      }}
                      disabled={!isEditingLegal}
                    />
                    <label
                      htmlFor={`closed-${index}`}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      Closed
                    </label>
                  </div>
                  <div className="flex gap-2 items-end justify-end">
                    {editData.openingHours.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newHours = editData.openingHours.filter(
                            (_, i) => i !== index,
                          );
                          setEditData({ ...editData, openingHours: newHours });
                        }}
                        className="h-9 w-9 p-0"
                        disabled={!isEditingLegal}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    {index === editData.openingHours.length - 1 && isEditingLegal && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditData({
                            ...editData,
                            openingHours: [
                              ...editData.openingHours,
                              { day: "", open: "", close: "", closed: false },
                            ],
                          });
                        }}
                        className="h-9 w-9 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- Contact Info Card --- */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-gray-400" />
              <h3 className="text-base font-semibold text-gray-900">
                Contact Information
              </h3>
            </div>
            {isEditingContact ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setIsEditingContact(false)}
                >
                  <XCircle className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-3"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsEditingContact(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Address
              </label>
              <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <textarea
                  value={editData.address}
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                  placeholder="Enter Address"
                  disabled={!isEditingContact}
                  rows={3}
                  className={`w-full border rounded-md p-3 pl-9 text-sm outline-none transition-colors resize-none ${isEditingContact ? "bg-white border-gray-300 text-gray-900 focus:border-gray-500" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={editData.mobile}
                  onChange={(e) =>
                    setEditData({ ...editData, mobile: e.target.value })
                  }
                  placeholder="Enter Mobile Number"
                  disabled={!isEditingContact}
                  className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm outline-none transition-colors ${isEditingContact ? "bg-white border-gray-300 text-gray-900 focus:border-gray-500" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                  placeholder="Enter Email"
                  disabled={!isEditingContact}
                  className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm outline-none transition-colors ${isEditingContact ? "bg-white border-gray-300 text-gray-900 focus:border-gray-500" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* --- Social Media Card --- */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Twitter className="h-5 w-5 text-gray-400" />
              <h3 className="text-base font-semibold text-gray-900">
                Social Media
              </h3>
            </div>
            {isEditingSocial ? (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => setIsEditingSocial(false)}
                >
                  <XCircle className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button
                  size="sm"
                  className="h-8 px-3"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setIsEditingSocial(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Facebook URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Facebook className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  value={editData.facebook}
                  onChange={(e) =>
                    setEditData({ ...editData, facebook: e.target.value })
                  }
                  placeholder="https://facebook.com/..."
                  disabled={!isEditingSocial}
                  className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm outline-none transition-colors ${isEditingSocial ? "bg-white border-gray-300 text-gray-900 focus:border-gray-500" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Twitter URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Twitter className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  value={editData.twitter}
                  onChange={(e) =>
                    setEditData({ ...editData, twitter: e.target.value })
                  }
                  placeholder="https://twitter.com/..."
                  disabled={!isEditingSocial}
                  className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm outline-none transition-colors ${isEditingSocial ? "bg-white border-gray-300 text-gray-900 focus:border-gray-500" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Instagram URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Instagram className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  value={editData.instagram}
                  onChange={(e) =>
                    setEditData({ ...editData, instagram: e.target.value })
                  }
                  placeholder="https://instagram.com/..."
                  disabled={!isEditingSocial}
                  className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm outline-none transition-colors ${isEditingSocial ? "bg-white border-gray-300 text-gray-900 focus:border-gray-500" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                LinkedIn URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Linkedin className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  value={editData.linkedin}
                  onChange={(e) =>
                    setEditData({ ...editData, linkedin: e.target.value })
                  }
                  placeholder="https://linkedin.com/..."
                  disabled={!isEditingSocial}
                  className={`w-full border rounded-md pl-9 pr-3 py-2 text-sm outline-none transition-colors ${isEditingSocial ? "bg-white border-gray-300 text-gray-900 focus:border-gray-500" : "bg-gray-50 border-gray-200 text-gray-600"}`}
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
