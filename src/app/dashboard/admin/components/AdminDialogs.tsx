import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Activity, AlertTriangle, Eye, User, XCircle } from "lucide-react";
import { UnifiedModal } from "@/components/ui/UnifiedModal";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import StatusBadge from "@/components/ui/StatusBadge";

interface BusinessListingInquiryDialogProps {
  showBusinessListingInquiryDialog: boolean;
  setShowBusinessListingInquiryDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBusinessListingInquiry: any;
  setSelectedBusinessListingInquiry: React.Dispatch<React.SetStateAction<any>>;
  handleUpdateBusinessListingInquiry: (inquiryId: string, updates: any) => Promise<void>;
}

export function BusinessListingInquiryDialog({
  showBusinessListingInquiryDialog,
  setShowBusinessListingInquiryDialog,
  selectedBusinessListingInquiry,
  setSelectedBusinessListingInquiry,
  handleUpdateBusinessListingInquiry,
}: BusinessListingInquiryDialogProps) {
  return (
    <UnifiedModal
      isOpen={showBusinessListingInquiryDialog}
      onClose={(open) => {
        if (!open) {
          setShowBusinessListingInquiryDialog(false);
          setSelectedBusinessListingInquiry(null);
        }
      }}
      title="Business Listing Inquiry Details"
      description="Review and manage this business listing inquiry"
      footer={
        <>
          <Button
            variant="outline"
            onClick={() => {
              setShowBusinessListingInquiryDialog(false);
              setSelectedBusinessListingInquiry(null);
            }}
            className="rounded-md w-auto px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedBusinessListingInquiry) {
                const updates: any = {
                  status: selectedBusinessListingInquiry?.status,
                  notes: selectedBusinessListingInquiry?.notes,
                };
                if (selectedBusinessListingInquiry?.assignedTo) {
                  updates.assignedTo = selectedBusinessListingInquiry.assignedTo;
                }
                handleUpdateBusinessListingInquiry(selectedBusinessListingInquiry?.id, updates);
              }
            }}
            className="rounded-md w-auto px-6 bg-black text-white hover:bg-gray-800"
          >
            Save Changes
          </Button>
        </>
      }
    >
      {selectedBusinessListingInquiry && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-900">Business Name</Label>
              <p className="text-sm text-gray-600 mt-1">{selectedBusinessListingInquiry?.businessName || "Not provided"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-900">Contact Name</Label>
              <p className="text-sm text-gray-600 mt-1">{selectedBusinessListingInquiry?.contactName || "Not provided"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-900">Email</Label>
              <p className="text-sm text-gray-600 mt-1">{selectedBusinessListingInquiry?.email || "Not provided"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-900">Phone</Label>
              <p className="text-sm text-gray-600 mt-1">{selectedBusinessListingInquiry.phone || "Not provided"}</p>
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-gray-900">Business Description</Label>
              <p className="text-sm text-gray-600 mt-1">{selectedBusinessListingInquiry?.businessDescription || "Not provided"}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-900">Inquiry Type</Label>
              <p className="text-sm text-gray-600 mt-1">{selectedBusinessListingInquiry?.inquiryType || "Not specified"}</p>
            </div>
            <div className="md:col-span-2">
              <Label className="text-sm font-medium text-gray-900">Requirements</Label>
              <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">
                {selectedBusinessListingInquiry?.requirements || "Not provided"}
              </p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Update Status</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <div className="relative">
                  <Select
                    value={selectedBusinessListingInquiry.status}
                    onValueChange={(value) => {
                      const updated = {
                        ...selectedBusinessListingInquiry,
                        status: value,
                      };
                      setSelectedBusinessListingInquiry(updated);
                    }}
                  >
                    <SelectTrigger className="rounded-md pl-10">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                  <Activity className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <div>
                <Label>Assign To</Label>
                <div className="relative">
                  <Select
                    value={selectedBusinessListingInquiry.assignedTo || ""}
                    onValueChange={(value) => {
                      const updated = {
                        ...selectedBusinessListingInquiry,
                        assignedTo: value || null,
                      };
                      setSelectedBusinessListingInquiry(updated);
                    }}
                  >
                    <SelectTrigger className="rounded-md pl-10">
                      <SelectValue placeholder="Select user or leave unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      <SelectItem value="admin1">Admin 1</SelectItem>
                      <SelectItem value="admin2">Admin 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={selectedBusinessListingInquiry?.notes || ""}
                onChange={(e) => {
                  const updated = {
                    ...selectedBusinessListingInquiry,
                    notes: e.target.value,
                  };
                  setSelectedBusinessListingInquiry(updated);
                }}
                placeholder="Add internal notes..."
                className="min-h-[100px] rounded-md pl-3"
              />
            </div>
          </div>
        </div>
      )}
    </UnifiedModal>
  );
}

interface AdminDialogsProps {
  showBulkDeleteDialog: boolean;
  setShowBulkDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedBusinessIds: Set<string>;
  businessBulkActions: { confirmBulkDelete: () => Promise<void> };
  bulkActionLoading: boolean;

  showProfessionalBulkDeleteDialog: boolean;
  setShowProfessionalBulkDeleteDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProfessionalIds: Set<string>;
  professionalBulkActions: { confirmBulkDelete: () => Promise<void> };
  professionalBulkActionLoading: boolean;

  showDeleteBusinessDialog: boolean;
  setShowDeleteBusinessDialog: React.Dispatch<React.SetStateAction<boolean>>;
  deleteBusiness: any;
  confirmDeleteBusiness: () => Promise<void>;
  setDeleteBusiness: React.Dispatch<React.SetStateAction<any>>;
  deletingBusiness: boolean;

  showDeleteProfessionalDialog: boolean;
  setShowDeleteProfessionalDialog: React.Dispatch<React.SetStateAction<boolean>>;
  professionalToDelete: any;
  confirmDeleteProfessional: () => Promise<void>;
  setProfessionalToDelete: React.Dispatch<React.SetStateAction<any>>;
  deletingProfessional: boolean;

  showDeleteCategoryDialog: boolean;
  setShowDeleteCategoryDialog: React.Dispatch<React.SetStateAction<boolean>>;
  categoryToDelete: any;
  confirmDeleteCategory: () => Promise<void>;
  setCategoryToDelete: React.Dispatch<React.SetStateAction<any>>;

  showRejectInquiryDialog: boolean;
  setShowRejectInquiryDialog: React.Dispatch<React.SetStateAction<boolean>>;
  inquiryToReject: any;
  setInquiryToReject: React.Dispatch<React.SetStateAction<any>>;
  rejectReason: string;
  setRejectReason: React.Dispatch<React.SetStateAction<string>>;
  confirmRejectInquiry: () => Promise<void>;
  creatingAccount: string | null;

  showRegistrationInquiryDialog: boolean;
  setShowRegistrationInquiryDialog: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRegistrationInquiry: any;
  setSelectedRegistrationInquiry: React.Dispatch<React.SetStateAction<any>>;
}

export function AdminDialogs(props: AdminDialogsProps) {
  return (
    <>
      <DeleteConfirmationDialog
        open={props.showBulkDeleteDialog}
        onOpenChange={props.setShowBulkDeleteDialog}
        title="Confirm Bulk Delete"
        description={`Delete ${props.selectedBusinessIds.size} businesses? This action cannot be undone.`}
        items={["Selected business accounts", "Associated admin users & data"]}
        onConfirm={props.businessBulkActions.confirmBulkDelete}
        loading={props.bulkActionLoading}
        confirmText="Delete"
        itemCount={props.selectedBusinessIds.size}
      />

      <DeleteConfirmationDialog
        open={props.showProfessionalBulkDeleteDialog}
        onOpenChange={props.setShowProfessionalBulkDeleteDialog}
        title="Confirm Bulk Delete"
        description={`Delete ${props.selectedProfessionalIds.size} professionals? This action cannot be undone.`}
        items={["Selected professional accounts", "Associated profile data"]}
        onConfirm={props.professionalBulkActions.confirmBulkDelete}
        loading={props.professionalBulkActionLoading}
        confirmText="Delete"
        itemCount={props.selectedProfessionalIds.size}
      />

      <DeleteConfirmationDialog
        open={props.showDeleteBusinessDialog}
        onOpenChange={props.setShowDeleteBusinessDialog}
        title="Delete Business"
        description={`Delete "${props.deleteBusiness?.name}"? This action cannot be undone.`}
        items={["Business account & listing", "Associated admin user & data"]}
        onConfirm={props.confirmDeleteBusiness}
        onCancel={() => props.setDeleteBusiness(null)}
        loading={props.deletingBusiness}
      />

      <DeleteConfirmationDialog
        open={props.showDeleteProfessionalDialog}
        onOpenChange={props.setShowDeleteProfessionalDialog}
        title="Delete Professional"
        description={`Delete "${props.professionalToDelete?.name}"? This action cannot be undone.`}
        items={["Professional profile & account", "Skills, education & portfolio"]}
        onConfirm={props.confirmDeleteProfessional}
        onCancel={() => props.setProfessionalToDelete(null)}
        loading={props.deletingProfessional}
      />

      <DeleteConfirmationDialog
        open={props.showDeleteCategoryDialog}
        onOpenChange={props.setShowDeleteCategoryDialog}
        title="Delete Category"
        description={`Delete "${props.categoryToDelete?.name}"? This action cannot be undone.`}
        items={["Category & subcategories", "Associated business references"]}
        onConfirm={props.confirmDeleteCategory}
        onCancel={() => props.setCategoryToDelete(null)}
      />

      <Dialog open={props.showRejectInquiryDialog} onOpenChange={props.setShowRejectInquiryDialog}>
        <DialogContent className="rounded-2xl max-w-sm p-4">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              Reject Registration Request
            </DialogTitle>
            <DialogDescription className="text-xs">
              Reject request from "{props.inquiryToReject?.name}"? A notification will be sent.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Type:</span>
                <span className="font-medium text-gray-900 ml-1">{props.inquiryToReject?.type}</span>
              </div>
              <div>
                <span className="text-gray-500">Email:</span>
                <span className="font-medium text-gray-900 ml-1 truncate">{props.inquiryToReject?.email}</span>
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="rejectReason" className="text-xs font-medium text-gray-900">
              Reason (optional)
            </Label>
            <Textarea
              id="rejectReason"
              value={props.rejectReason}
              onChange={(e) => props.setRejectReason(e.target.value)}
              placeholder="Enter reason..."
              className="rounded-xl resize-none text-xs h-16"
            />
          </div>
          <DialogFooter className="pt-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                props.setShowRejectInquiryDialog(false);
                props.setInquiryToReject(null);
                props.setRejectReason("");
              }}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={props.confirmRejectInquiry}
              disabled={props.creatingAccount === props.inquiryToReject?.id}
              className="rounded-xl"
            >
              {props.creatingAccount === props.inquiryToReject?.id ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <XCircle className="h-3 w-3 mr-1" />
                  Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={props.showRegistrationInquiryDialog} onOpenChange={props.setShowRegistrationInquiryDialog}>
        <DialogContent className="rounded-2xl max-w-lg p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="flex items-center gap-2 text-base">
              <Eye className="h-4 w-4" />
              Registration Request Details
            </DialogTitle>
            <DialogDescription className="text-xs">Full details of the registration request</DialogDescription>
          </DialogHeader>
          {props.selectedRegistrationInquiry && (
            <div className="space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500 text-xs">Type</span>
                    <p className="font-medium text-gray-900">
                      {props.selectedRegistrationInquiry.type === "BUSINESS" ? "Business" : "Professional"}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Status</span>
                    <p className="font-medium text-gray-900">
                      <StatusBadge
                        status={props.selectedRegistrationInquiry.status}
                        variant={
                          props.selectedRegistrationInquiry.status === "PENDING"
                            ? "warning"
                            : props.selectedRegistrationInquiry.status === "COMPLETED"
                              ? "success"
                              : props.selectedRegistrationInquiry.status === "REJECTED"
                                ? "error"
                                : "info"
                        }
                      />
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Name</span>
                    <p className="font-medium text-gray-900">{props.selectedRegistrationInquiry.name || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Email</span>
                    <p className="font-medium text-gray-900">{props.selectedRegistrationInquiry.email || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Phone</span>
                    <p className="font-medium text-gray-900">{props.selectedRegistrationInquiry.phone || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs">Location</span>
                    <p className="font-medium text-gray-900">{props.selectedRegistrationInquiry.location || "Not provided"}</p>
                  </div>
                  {props.selectedRegistrationInquiry.type === "BUSINESS" && (
                    <>
                      <div className="col-span-2">
                        <span className="text-gray-500 text-xs">Business Name</span>
                        <p className="font-medium text-gray-900">
                          {props.selectedRegistrationInquiry.businessName || "Not provided"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-500 text-xs">Business Description</span>
                        <p className="font-medium text-gray-900">
                          {props.selectedRegistrationInquiry.businessDescription || "Not provided"}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Website</span>
                        <p className="font-medium text-gray-900">{props.selectedRegistrationInquiry.website || "Not provided"}</p>
                      </div>
                    </>
                  )}
                  {props.selectedRegistrationInquiry.type === "PROFESSIONAL" && (
                    <>
                      <div>
                        <span className="text-gray-500 text-xs">Profession</span>
                        <p className="font-medium text-gray-900">{props.selectedRegistrationInquiry.profession || "Not provided"}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">About Me</span>
                        <p className="font-medium text-gray-900">{props.selectedRegistrationInquiry.aboutMe || "Not provided"}</p>
                      </div>
                    </>
                  )}
                  <div>
                    <span className="text-gray-500 text-xs">Submitted On</span>
                    <p className="font-medium text-gray-900">
                      {props.selectedRegistrationInquiry.createdAt
                        ? new Date(props.selectedRegistrationInquiry.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Not provided"}
                    </p>
                  </div>
                  {props.selectedRegistrationInquiry.status === "REJECTED" &&
                    props.selectedRegistrationInquiry.rejectReason && (
                      <div className="col-span-2">
                        <span className="text-gray-500 text-xs">Reject Reason</span>
                        <p className="font-medium text-red-600">{props.selectedRegistrationInquiry.rejectReason}</p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="pt-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                props.setShowRegistrationInquiryDialog(false);
                props.setSelectedRegistrationInquiry(null);
              }}
              className="rounded-xl"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
