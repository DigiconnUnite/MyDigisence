import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardOverview from "./DashboardOverview";
import BusinessesView from "./BusinessesView";
import ProfessionalsView from "./ProfessionalsView";
import CategoriesView from "./CategoriesView";
import InquiriesView from "./InquiriesView";
import RegistrationRequestsView from "./RegistrationRequestsView";
import BusinessListingsView from "./BusinessListingsView";

interface MainViewRouterProps {
  currentView: string;
  stats: any;
  businesses: any[];
  professionals: any[];
  registrationInquiries: any[];
  setRightPanelContent: (value: any) => void;
  setShowRightPanel: (value: boolean) => void;
  dataFetchError: string | null;
  fetchData: () => Promise<void>;
  fetchBusinesses: () => Promise<void>;
  businessQuery: any;
  setBusinessQuery: React.Dispatch<React.SetStateAction<any>>;
  businessData: any;
  filteredBusinesses: any[];
  handleExport: () => Promise<void>;
  exportLoading: boolean;
  addBusinessLoading: boolean;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedBusinessIds: Set<string>;
  handleSelectAll: () => void;
  handleDeselectAll: () => void;
  handleSelectBusiness: (businessId: string) => void;
  businessBulkActions: any;
  businessLoading: boolean;
  toggleLoading: string | null;
  handleToggleBusinessStatus: (e: React.MouseEvent, business: any) => Promise<void>;
  handleEditBusiness: (business: any) => void;
  handleDeleteBusiness: (business: any) => void;
  handlePageChange: (page: number) => void;
  handleLimitChange: (limit: number) => void;
  fetchProfessionals: () => Promise<void>;
  professionalQuery: any;
  setProfessionalQuery: React.Dispatch<React.SetStateAction<any>>;
  professionalData: any;
  handleProfessionalExport: () => Promise<void>;
  professionalExportLoading: boolean;
  addProfessionalLoading: boolean;
  selectedProfessionalIds: Set<string>;
  handleSelectAllProfessionals: () => void;
  handleDeselectAllProfessionals: () => void;
  handleSelectProfessional: (id: string) => void;
  professionalBulkActions: any;
  professionalLoading: boolean;
  handleProfessionalSort: (column: string) => void;
  getProfessionalSortIcon: (column: string) => React.ReactNode;
  professionalToggleLoading: string | null;
  handleToggleProfessionalStatus: (e: React.MouseEvent, professional: any) => Promise<void>;
  handleEditProfessional: (professional: any) => void;
  handleDeleteProfessional: (professional: any) => void;
  handleProfessionalPageChange: (page: number) => void;
  handleProfessionalLimitChange: (limit: number) => void;
  selectedCategories: Set<string>;
  setSelectedCategories: React.Dispatch<React.SetStateAction<Set<string>>>;
  categories: any[];
  filteredCategories: any[];
  toast: (args: { title: string; description: string; variant?: "destructive" }) => void;
  inquiries: any[];
  selectedInquiries: Set<string>;
  handleSelectAllInquiries: () => void;
  handleDeselectAllInquiries: () => void;
  handleInquiryBulkActivate: () => Promise<void>;
  handleInquiryBulkSuspend: () => Promise<void>;
  handleInquiryBulkDelete: () => void;
  handleViewInquiry: (inquiry: any) => void;
  handleReplyInquiry: (inquiry: any) => void;
  handleDeleteInquiry: (inquiry: any) => void;
  inquiryQuery: any;
  setInquiryQuery: React.Dispatch<React.SetStateAction<any>>;
  inquiryPagination: any;
  selectedRegistrationInquiry: any;
  setSelectedRegistrationInquiry: React.Dispatch<React.SetStateAction<any>>;
  showRegistrationInquiryDialog: boolean;
  setShowRegistrationInquiryDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleCreateAccountFromInquiryWithSidebar: (inquiry: any) => void;
  handleRejectInquiry: (inquiry: any) => void;
  confirmRejectInquiry: () => Promise<void>;
  creatingAccount: string | null;
  inquiryToReject: any;
  rejectReason: string;
  setRejectReason: React.Dispatch<React.SetStateAction<string>>;
  setInquiryToReject: React.Dispatch<React.SetStateAction<any>>;
  showRejectInquiryDialog: boolean;
  setShowRejectInquiryDialog: React.Dispatch<React.SetStateAction<boolean>>;
  businessListingInquiries: any[];
  selectedBusinessListings: Set<string>;
  setSelectedBusinessListings: React.Dispatch<React.SetStateAction<Set<string>>>;
  setSelectedBusinessListingInquiry: React.Dispatch<React.SetStateAction<any>>;
  setShowBusinessListingInquiryDialog: React.Dispatch<React.SetStateAction<boolean>>;
  handleEditCategory: (category: any) => void;
  handleDeleteCategory: (category: any) => void;
  isLoading: boolean;
}

export default function MainViewRouter(props: MainViewRouterProps) {
  if (props.isLoading) {
    return null;
  }

  const safeCategories = Array.isArray(props.categories) ? props.categories : [];

  switch (props.currentView) {
    case "dashboard":
      return (
        <DashboardOverview
          stats={props.stats}
          businesses={props.businesses}
          professionals={props.professionals}
          registrationInquiries={props.registrationInquiries}
          onAddBusiness={() => {
            props.setRightPanelContent("add-business");
            props.setShowRightPanel(true);
          }}
          onAddProfessional={() => {
            props.setRightPanelContent("add-professional");
            props.setShowRightPanel(true);
          }}
          onAddCategory={() => {
            props.setRightPanelContent("add-category");
            props.setShowRightPanel(true);
          }}
        />
      );
    case "businesses":
      return (
        <BusinessesView
          dataFetchError={props.dataFetchError}
          fetchData={props.fetchData}
          fetchBusinesses={props.fetchBusinesses}
          businessQuery={props.businessQuery}
          setBusinessQuery={props.setBusinessQuery}
          businessData={props.businessData}
          filteredBusinesses={props.filteredBusinesses}
          handleExport={props.handleExport}
          exportLoading={props.exportLoading}
          onOpenAddBusiness={() => {
            props.setRightPanelContent("add-business");
            props.setShowRightPanel(true);
          }}
          addBusinessLoading={props.addBusinessLoading}
          searchTerm={props.searchTerm}
          setSearchTerm={props.setSearchTerm}
          selectedBusinessIds={props.selectedBusinessIds}
          handleSelectAll={props.handleSelectAll}
          handleDeselectAll={props.handleDeselectAll}
          handleSelectBusiness={props.handleSelectBusiness}
          businessBulkActions={props.businessBulkActions}
          businessLoading={props.businessLoading}
          toggleLoading={props.toggleLoading}
          handleToggleBusinessStatus={props.handleToggleBusinessStatus}
          handleEditBusiness={props.handleEditBusiness}
          handleDeleteBusiness={props.handleDeleteBusiness}
          handlePageChange={props.handlePageChange}
          handleLimitChange={props.handleLimitChange}
        />
      );
    case "professionals":
      return (
        <ProfessionalsView
          dataFetchError={props.dataFetchError}
          fetchData={props.fetchData}
          fetchProfessionals={props.fetchProfessionals}
          professionalQuery={props.professionalQuery}
          setProfessionalQuery={props.setProfessionalQuery}
          professionalData={props.professionalData}
          professionals={props.professionals}
          handleProfessionalExport={props.handleProfessionalExport}
          professionalExportLoading={props.professionalExportLoading}
          onOpenAddProfessional={() => {
            props.setRightPanelContent("add-professional");
            props.setShowRightPanel(true);
          }}
          addProfessionalLoading={props.addProfessionalLoading}
          searchTerm={props.searchTerm}
          setSearchTerm={props.setSearchTerm}
          selectedProfessionalIds={props.selectedProfessionalIds}
          handleSelectAllProfessionals={props.handleSelectAllProfessionals}
          handleDeselectAllProfessionals={props.handleDeselectAllProfessionals}
          handleSelectProfessional={props.handleSelectProfessional}
          professionalBulkActions={props.professionalBulkActions}
          professionalLoading={props.professionalLoading}
          handleProfessionalSort={props.handleProfessionalSort}
          getProfessionalSortIcon={props.getProfessionalSortIcon}
          professionalToggleLoading={props.professionalToggleLoading}
          handleToggleProfessionalStatus={props.handleToggleProfessionalStatus}
          handleEditProfessional={props.handleEditProfessional}
          handleDeleteProfessional={props.handleDeleteProfessional}
          handleProfessionalPageChange={props.handleProfessionalPageChange}
          handleProfessionalLimitChange={props.handleProfessionalLimitChange}
        />
      );
    case "categories":
      return (
        <CategoriesView
          searchTerm={props.searchTerm}
          setSearchTerm={props.setSearchTerm}
          onOpenAddCategory={() => {
            props.setRightPanelContent("add-category");
            props.setShowRightPanel(true);
          }}
          selectedCategories={props.selectedCategories}
          setSelectedCategories={props.setSelectedCategories}
          safeCategories={safeCategories}
          filteredCategories={props.filteredCategories}
          onInfoToast={(description) => {
            props.toast({ title: "Info", description });
          }}
          handleEditCategory={props.handleEditCategory}
          handleDeleteCategory={props.handleDeleteCategory}
        />
      );
    case "inquiries":
      return (
        <InquiriesView
          searchTerm={props.searchTerm}
          setSearchTerm={props.setSearchTerm}
          inquiries={props.inquiries}
          selectedInquiries={props.selectedInquiries}
          handleSelectAllInquiries={props.handleSelectAllInquiries}
          handleDeselectAllInquiries={props.handleDeselectAllInquiries}
          handleInquiryBulkActivate={props.handleInquiryBulkActivate}
          handleInquiryBulkSuspend={props.handleInquiryBulkSuspend}
          handleInquiryBulkDelete={props.handleInquiryBulkDelete}
          handleViewInquiry={props.handleViewInquiry}
          handleReplyInquiry={props.handleReplyInquiry}
          handleDeleteInquiry={props.handleDeleteInquiry}
          inquiryQuery={props.inquiryQuery}
          setInquiryQuery={props.setInquiryQuery}
          inquiryPagination={props.inquiryPagination}
        />
      );
    case "registration-requests":
      return (
        <RegistrationRequestsView
          searchTerm={props.searchTerm}
          setSearchTerm={props.setSearchTerm}
          registrationInquiries={props.registrationInquiries}
          isLoading={props.isLoading}
          dataFetchError={props.dataFetchError}
          fetchData={props.fetchData}
          selectedRegistrationInquiry={props.selectedRegistrationInquiry}
          setSelectedRegistrationInquiry={props.setSelectedRegistrationInquiry}
          showRegistrationInquiryDialog={props.showRegistrationInquiryDialog}
          setShowRegistrationInquiryDialog={props.setShowRegistrationInquiryDialog}
          handleCreateAccountFromInquiryWithSidebar={props.handleCreateAccountFromInquiryWithSidebar}
          handleRejectInquiry={props.handleRejectInquiry}
          confirmRejectInquiry={props.confirmRejectInquiry}
          creatingAccount={props.creatingAccount}
          inquiryToReject={props.inquiryToReject}
          rejectReason={props.rejectReason}
          setRejectReason={props.setRejectReason}
          setInquiryToReject={props.setInquiryToReject}
          showRejectInquiryDialog={props.showRejectInquiryDialog}
          setShowRejectInquiryDialog={props.setShowRejectInquiryDialog}
          toast={props.toast}
        />
      );
    case "business-listings":
      return (
        <BusinessListingsView
          searchTerm={props.searchTerm}
          setSearchTerm={props.setSearchTerm}
          businessListingInquiries={props.businessListingInquiries}
          selectedBusinessListings={props.selectedBusinessListings}
          setSelectedBusinessListings={props.setSelectedBusinessListings}
          fetchData={props.fetchData}
          setSelectedBusinessListingInquiry={props.setSelectedBusinessListingInquiry}
          setShowBusinessListingInquiryDialog={props.setShowBusinessListingInquiryDialog}
          businessListingBulkToast={(description) => props.toast({ title: "Info", description })}
        />
      );
    case "analytics":
      return (
        <div className="space-y-6 pb-20 md:pb-0">
          <div className="mb-8">
            <h1 className="text-lg font-bold text-gray-900">Platform Analytics</h1>
            <p className="text-md text-gray-600">Detailed analytics and insights</p>
          </div>
        </div>
      );
    case "settings":
      return (
        <div className="space-y-6 pb-20 md:pb-0">
          <div className="mb-8">
            <h1 className="text-lg font-bold text-gray-900">System Settings</h1>
            <p className="text-md text-gray-600">Configure system preferences</p>
          </div>
          <div className="p-4 bg-white rounded-3xl sm:p-6">
            <div className="space-y-4">
              <div>
                <Label>Platform Name</Label>
                <Input defaultValue="DigiSense" className="rounded-2xl" />
              </div>
              <div>
                <Label>Admin Email</Label>
                <Input defaultValue="admin@digisence.com" className="rounded-2xl" />
              </div>
              <Button className="rounded-2xl">Save Settings</Button>
            </div>
          </div>
        </div>
      );
    default:
      return <div>Select a menu item</div>;
  }
}
