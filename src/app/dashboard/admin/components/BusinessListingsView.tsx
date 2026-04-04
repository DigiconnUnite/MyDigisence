import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { BulkActionsToolbar } from "@/components/ui/pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import { Activity, Building, Edit, Eye, RefreshCw, User } from "lucide-react";
import AdminViewControls from "./AdminViewControls";
import AdminSectionHeader from "./AdminSectionHeader";
import AdminActionIconButton from "./AdminActionIconButton";
import AdminEmptyState from "./AdminEmptyState";

interface BusinessListingsViewProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  businessListingInquiries: any[];
  selectedBusinessListings: Set<string>;
  setSelectedBusinessListings: React.Dispatch<React.SetStateAction<Set<string>>>;
  fetchData: () => Promise<void>;
  setSelectedBusinessListingInquiry: React.Dispatch<React.SetStateAction<any>>;
  setShowBusinessListingInquiryDialog: React.Dispatch<React.SetStateAction<boolean>>;
  businessListingBulkToast: (description: string) => void;
}

export default function BusinessListingsView({
  searchTerm,
  setSearchTerm,
  businessListingInquiries,
  selectedBusinessListings,
  setSelectedBusinessListings,
  fetchData,
  setSelectedBusinessListingInquiry,
  setShowBusinessListingInquiryDialog,
  businessListingBulkToast,
}: BusinessListingsViewProps) {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <AdminSectionHeader
        title="Business Listing Inquiries"
        description="Manage business listing requests and digital presence enhancement inquiries"
      />

      <AdminViewControls
        actions={
          <Button variant="outline" onClick={() => fetchData()} className="rounded-xl border-gray-200">
            <RefreshCw className="h-4 w-4 text-gray-500 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        }
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search business listings..."
      />

      {selectedBusinessListings.size > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <BulkActionsToolbar
            selectedCount={selectedBusinessListings.size}
            totalCount={businessListingInquiries.length}
            onSelectAll={() => setSelectedBusinessListings(new Set(businessListingInquiries.map((i) => i.id)))}
            onDeselectAll={() => setSelectedBusinessListings(new Set())}
            onBulkActivate={() => businessListingBulkToast("Bulk activate not implemented for listings")}
            onBulkDeactivate={() => businessListingBulkToast("Bulk deactivate not implemented for listings")}
            onBulkDelete={() => businessListingBulkToast("Bulk delete not implemented for listings")}
          />
        </div>
      )}

      {businessListingInquiries.length > 0 ? (
        <div className="bg-white rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-[#080322]">
                <TableRow>
                  <TableHead className="w-12 text-white font-medium">
                    <Checkbox
                      checked={businessListingInquiries.length > 0 && selectedBusinessListings.size === businessListingInquiries.length}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedBusinessListings(new Set(businessListingInquiries.map((i) => i.id)));
                        } else {
                          setSelectedBusinessListings(new Set());
                        }
                      }}
                      className="border-gray-400"
                    />
                  </TableHead>
                  <TableHead className="w-14 text-white font-medium">SN.</TableHead>
                  <TableHead className="text-white font-medium">Business</TableHead>
                  <TableHead className="text-white font-medium">Contact</TableHead>
                  <TableHead className="text-white font-medium">Requirements</TableHead>
                  <TableHead className="text-white font-medium">Inquiry Type</TableHead>
                  <TableHead className="text-center text-white font-medium">Status</TableHead>
                  <TableHead className="text-white font-medium">Assigned To</TableHead>
                  <TableHead className="text-white font-medium">Date</TableHead>
                  <TableHead className="text-center text-white font-medium ">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businessListingInquiries
                  .filter((inquiry) => {
                    const matchesSearch =
                      inquiry.businessName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      inquiry.contactName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      inquiry.requirements?.toLowerCase().includes(searchTerm.toLowerCase());
                    return matchesSearch;
                  })
                  .map((inquiry, index) => (
                    <TableRow key={inquiry.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedBusinessListings.has(inquiry.id)}
                          onCheckedChange={() => {
                            setSelectedBusinessListings((prev) => {
                              const newSet = new Set(prev);
                              if (newSet.has(inquiry.id)) newSet.delete(inquiry.id);
                              else newSet.add(inquiry.id);
                              return newSet;
                            });
                          }}
                          className="border-gray-400"
                        />
                      </TableCell>
                      <TableCell className="text-gray-500 font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{inquiry.businessName}</div>
                          {inquiry.businessDescription && (
                            <div className="text-sm text-gray-500 max-w-xs truncate">{inquiry.businessDescription}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{inquiry.contactName}</div>
                          <div className="text-sm text-gray-500">{inquiry.email}</div>
                          {inquiry.phone && <div className="text-sm text-gray-500">{inquiry.phone}</div>}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 max-w-xs truncate">{inquiry.requirements}</TableCell>
                      <TableCell className="text-gray-600">{inquiry.inquiryType || "Not specified"}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <StatusBadge
                            status={inquiry.status}
                            variant={
                              inquiry.status === "PENDING"
                                ? "warning"
                                : inquiry.status === "REVIEWING" || inquiry.status === "UNDER_REVIEW"
                                  ? "info"
                                  : inquiry.status === "APPROVED"
                                    ? "success"
                                    : inquiry.status === "REJECTED"
                                      ? "error"
                                      : "neutral"
                            }
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">{inquiry.assignedUser?.name || "Unassigned"}</TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-1">
                          <AdminActionIconButton
                            onClick={() => {
                              setSelectedBusinessListingInquiry(inquiry);
                              setShowBusinessListingInquiryDialog(true);
                            }}
                            title="View Details"
                            rounded="md"
                          >
                            <Eye className="h-4 w-4 text-gray-500" />
                          </AdminActionIconButton>
                          <AdminActionIconButton
                            onClick={() => {
                              setSelectedBusinessListingInquiry(inquiry);
                              setShowBusinessListingInquiryDialog(true);
                            }}
                            title="Edit"
                            rounded="md"
                          >
                            <Edit className="h-4 w-4 text-gray-500" />
                          </AdminActionIconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <AdminEmptyState
          icon={<Building className="h-8 w-8 text-gray-400" />}
          title="No Business Listings Found"
          description="There are currently no business listing inquiries to review."
          className="bg-white rounded-2xl"
        />
      )}
    </div>
  );
}
