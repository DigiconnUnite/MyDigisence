import { BusinessInfoCard } from "../components/BusinessInfoCard";
import type { BusinessInfoFormData } from "../types";

interface BusinessInfoSectionProps {
  formData: BusinessInfoFormData;
  fallbackAdminName: string;
  onEdit: () => void;
  onLogoUpload: (url: string) => void;
}

export function BusinessInfoSection({
  formData,
  fallbackAdminName,
  onEdit,
  onLogoUpload,
}: BusinessInfoSectionProps) {
  return (
    <div className=" mx-auto">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-900">Business Info</h1>
        <p className="text-md text-gray-600">Manage your business information</p>
      </div>

      <div className="mb-8">
        <BusinessInfoCard
          businessName={formData.name || "Your Business"}
          adminName={formData.ownerName || fallbackAdminName}
          description={formData.description || "Add your business description"}
          logoUrl={formData.logo}
          onEdit={onEdit}
          onLogoUpload={onLogoUpload}
          gstNumber={formData.gstNumber}
          openingHours={formData.openingHours}
          address={formData.address}
          mobile={formData.phone}
          email={formData.email}
          socialLinks={{
            facebook: formData.facebook,
            twitter: formData.twitter,
            instagram: formData.instagram,
            linkedin: formData.linkedin,
          }}
        />
      </div>
    </div>
  );
}