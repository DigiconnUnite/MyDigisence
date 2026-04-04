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
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { BulkActionsToolbar, Pagination } from "@/components/ui/pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import {
  Download,
  Edit,
  Eye,
  Filter,
  MapPin,
  Plus,
  Power,
  Trash2,
  User,
} from "lucide-react";
import AdminViewControls from "./AdminViewControls";
import AdminSectionHeader from "./AdminSectionHeader";
import AdminActionIconButton from "./AdminActionIconButton";
import AdminErrorAlert from "./AdminErrorAlert";
import AdminEmptyState from "./AdminEmptyState";
import type { Professional, ProfessionalApiResponse, BusinessQueryParams } from "../types";

interface ProfessionalsViewProps {
  dataFetchError: string | null;
  fetchData: () => Promise<void>;
  fetchProfessionals: () => Promise<void>;
  professionalQuery: BusinessQueryParams;
  setProfessionalQuery: React.Dispatch<React.SetStateAction<BusinessQueryParams>>;
  professionalData: ProfessionalApiResponse | null;
  professionals: Professional[];
  handleProfessionalExport: () => Promise<void>;
  professionalExportLoading: boolean;
  onOpenAddProfessional: () => void;
  addProfessionalLoading: boolean;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedProfessionalIds: Set<string>;
  handleSelectAllProfessionals: () => void;
  handleDeselectAllProfessionals: () => void;
  handleSelectProfessional: (id: string) => void;
  professionalBulkActions: {
    handleBulkActivate: () => Promise<void>;
    handleBulkDeactivate: () => Promise<void>;
    handleBulkDelete: () => Promise<void>;
  };
  professionalLoading: boolean;
  handleProfessionalSort: (column: string) => void;
  getProfessionalSortIcon: (column: string) => React.ReactNode;
  professionalToggleLoading: string | null;
  handleToggleProfessionalStatus: (e: React.MouseEvent, professional: Professional) => Promise<void>;
  handleEditProfessional: (professional: Professional) => void;
  handleDeleteProfessional: (professional: Professional) => void;
  handleProfessionalPageChange: (page: number) => void;
  handleProfessionalLimitChange: (limit: number) => void;
}

export default function ProfessionalsView({
  dataFetchError,
  fetchData,
  fetchProfessionals,
  professionalQuery,
  setProfessionalQuery,
  professionalData,
  professionals,
  handleProfessionalExport,
  professionalExportLoading,
  onOpenAddProfessional,
  addProfessionalLoading,
  searchTerm,
  setSearchTerm,
  selectedProfessionalIds,
  handleSelectAllProfessionals,
  handleDeselectAllProfessionals,
  handleSelectProfessional,
  professionalBulkActions,
  professionalLoading,
  handleProfessionalSort,
  getProfessionalSortIcon,
  professionalToggleLoading,
  handleToggleProfessionalStatus,
  handleEditProfessional,
  handleDeleteProfessional,
  handleProfessionalPageChange,
  handleProfessionalLimitChange,
}: ProfessionalsViewProps) {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      {dataFetchError && (
        <AdminErrorAlert
          message={dataFetchError}
          onRetry={() => {
            fetchData();
            fetchProfessionals();
          }}
        />
      )}

      <AdminSectionHeader
        title="Manage Professionals"
        description="Add, view, edit, and manage all registered professionals"
      />

      <AdminViewControls
        actions={
          <>
          <Select
            value={professionalQuery.status}
            onValueChange={(value) => {
              setProfessionalQuery((prev) => ({
                ...prev,
                status: value,
                page: 1,
              }));
            }}
          >
            <SelectTrigger className=" rounded-xl bg-white border-gray-200">
              <Filter className="h-4 w-4 text-gray-500 mr-2" />
              <span className="hidden sm:inline">Filter</span>
              <span className="sm:hidden">Status</span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({professionalData?.pagination.totalItems || professionals.length})</SelectItem>
              <SelectItem value="active">Active ({professionals.filter((p) => p.isActive).length})</SelectItem>
              <SelectItem value="inactive">Inactive ({professionals.filter((p) => !p.isActive).length})</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleProfessionalExport}
            disabled={professionalExportLoading}
            className="rounded-xl border-gray-200"
          >
            {professionalExportLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 mr-2" />
            ) : (
              <Download className="h-4 w-4 text-gray-500 mr-2" />
            )}
            <span className="hidden sm:inline">
              {professionalExportLoading ? "Exporting..." : "Export"}
            </span>
            <span className="sm:hidden">{professionalExportLoading ? "..." : ""}</span>
          </Button>

          <Button
            onClick={onOpenAddProfessional}
            disabled={addProfessionalLoading}
            className="rounded-xl bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white hover:opacity-90 transition-opacity"
          >
            {addProfessionalLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            <span className="hidden sm:inline">
              {addProfessionalLoading ? "Opening..." : "Add Professional"}
            </span>
            <span className="sm:hidden">{addProfessionalLoading ? "..." : "Add"}</span>
          </Button>
          </>
        }
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search professionals..."
      />

      {selectedProfessionalIds.size > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <BulkActionsToolbar
            selectedCount={selectedProfessionalIds.size}
            totalCount={professionalData?.pagination.totalItems || professionals.length}
            onSelectAll={handleSelectAllProfessionals}
            onDeselectAll={handleDeselectAllProfessionals}
            onBulkActivate={professionalBulkActions.handleBulkActivate}
            onBulkDeactivate={professionalBulkActions.handleBulkDeactivate}
            onBulkDelete={professionalBulkActions.handleBulkDelete}
          />
        </div>
      )}

      <div className="bg-white rounded-md   overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#080322]">
              <TableRow>
                <TableHead className="w-12 text-white font-medium">
                  <Checkbox
                    checked={
                      professionalData?.professionals.every((p) => selectedProfessionalIds.has(p.id)) || false
                    }
                    onCheckedChange={(checked) => {
                      if (checked) handleSelectAllProfessionals();
                      else handleDeselectAllProfessionals();
                    }}
                    className="border-gray-400"
                  />
                </TableHead>
                <TableHead className="w-14 text-white font-medium">SN.</TableHead>
                <TableHead className="text-white font-medium cursor-pointer" onClick={() => handleProfessionalSort("name")}>
                  <div className="flex items-center gap-1">Professional {getProfessionalSortIcon("name")}</div>
                </TableHead>
                <TableHead className="text-white font-medium cursor-pointer" onClick={() => handleProfessionalSort("email")}>
                  <div className="flex items-center gap-1">Email {getProfessionalSortIcon("email")}</div>
                </TableHead>
                <TableHead className="text-white font-medium cursor-pointer" onClick={() => handleProfessionalSort("professionalHeadline")}>
                  <div className="flex items-center gap-1">Headline {getProfessionalSortIcon("professionalHeadline")}</div>
                </TableHead>
                <TableHead className="text-white  truncate font-medium">Location</TableHead>
                <TableHead className="text-center text-white font-medium">Status</TableHead>
                <TableHead className="text-white font-medium cursor-pointer" onClick={() => handleProfessionalSort("createdAt")}>
                  <div className="flex items-center gap-1">Date {getProfessionalSortIcon("createdAt")}</div>
                </TableHead>
                <TableHead className="text-center text-white font-medium w-32">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {professionalLoading
                ? Array.from({ length: professionalQuery.limit }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-4" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-8" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-40" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-20" />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-2">
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                : professionalData?.professionals.map((professional, index) => (
                    <TableRow key={professional.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedProfessionalIds.has(professional.id)}
                          onCheckedChange={() => handleSelectProfessional(professional.id)}
                          className="border-gray-400"
                        />
                      </TableCell>
                      <TableCell className="text-gray-500 font-medium">
                        {(professionalData.pagination.page - 1) * professionalData.pagination.limit + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {professional.profilePicture ? (
                            <img
                              src={professional.profilePicture}
                              alt={`${professional.name} profile`}
                              className="h-10 w-10 rounded-full object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <span className="text-gray-900 font-medium truncate max-w-[200px]">{professional.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 truncate">{professional.email || "N/A"}</TableCell>
                      <TableCell className="text-gray-600 truncate max-w-[150px]">
                        {professional.professionalHeadline || "No headline"}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          {professional.location || "Not specified"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <StatusBadge
                            status={professional.isActive ? "ACTIVE" : "SUSPENDED"}
                            variant={professional.isActive ? "success" : "error"}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {new Date(professional.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className={`h-8 w-8 p-0 rounded-lg ${
                              professional.isActive ? "hover:bg-orange-50" : "hover:bg-green-50"
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              handleToggleProfessionalStatus(e, professional);
                            }}
                            disabled={professionalToggleLoading === professional.id}
                            title={professional.isActive ? "Deactivate Professional" : "Activate Professional"}
                          >
                            {professionalToggleLoading === professional.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500" />
                            ) : (
                              <Power
                                className={`h-4 w-4 ${
                                  professional.isActive ? "text-orange-500" : "text-green-500"
                                }`}
                              />
                            )}
                          </Button>
                          <AdminActionIconButton
                            onClick={() => window.open(`/pcard/${professional.slug}`, "_blank")}
                            title="View Profile"
                          >
                            <Eye className="h-4 w-4 text-gray-500" />
                          </AdminActionIconButton>
                          <AdminActionIconButton
                            onClick={() => handleEditProfessional(professional)}
                            title="Edit Professional"
                          >
                            <Edit className="h-4 w-4 text-gray-500" />
                          </AdminActionIconButton>
                          <AdminActionIconButton
                            onClick={() => handleDeleteProfessional(professional)}
                            title="Delete Professional"
                            tone="danger"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </AdminActionIconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>

        {!professionalLoading && (!professionalData?.professionals || professionalData.professionals.length === 0) && (
          <AdminEmptyState
            icon={<User className="h-8 w-8 text-gray-400" />}
            title="No professionals found"
            description={
              searchTerm || professionalQuery.status !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by adding your first professional"
            }
            action={
              !searchTerm && professionalQuery.status === "all" ? (
                <Button
                  onClick={onOpenAddProfessional}
                  className="bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white rounded-xl hover:opacity-90 transition-opacity"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Professional
                </Button>
              ) : undefined
            }
          />
        )}

        {professionalData && professionalData.professionals.length > 0 && (
          <div className="p-2 border-t">
            <Pagination
              currentPage={professionalData.pagination.page}
              totalPages={professionalData.pagination.totalPages}
              totalItems={professionalData.pagination.totalItems}
              itemsPerPage={professionalData.pagination.limit}
              onPageChange={handleProfessionalPageChange}
              onItemsPerPageChange={handleProfessionalLimitChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
