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
import { BulkActionsToolbar, Pagination } from "@/components/ui/pagination";
import StatusBadge from "@/components/ui/StatusBadge";
import { Eye, Mail, SlidersHorizontal, Trash2, User, MessageSquare } from "lucide-react";
import AdminViewControls from "./AdminViewControls";
import AdminSectionHeader from "./AdminSectionHeader";
import AdminActionIconButton from "./AdminActionIconButton";
import AdminEmptyState from "./AdminEmptyState";
import type { BusinessQueryParams } from "../types";

interface InquiriesViewProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
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
  inquiryQuery: BusinessQueryParams;
  setInquiryQuery: React.Dispatch<React.SetStateAction<BusinessQueryParams>>;
  inquiryPagination: { page: number; limit: number; totalItems: number; totalPages: number } | null;
}

export default function InquiriesView({
  searchTerm,
  setSearchTerm,
  inquiries,
  selectedInquiries,
  handleSelectAllInquiries,
  handleDeselectAllInquiries,
  handleInquiryBulkActivate,
  handleInquiryBulkSuspend,
  handleInquiryBulkDelete,
  handleViewInquiry,
  handleReplyInquiry,
  handleDeleteInquiry,
  inquiryQuery,
  setInquiryQuery,
  inquiryPagination,
}: InquiriesViewProps) {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <AdminSectionHeader
        title="Contact Inquiries Management"
        description="View and manage customer inquiries"
      />

      <AdminViewControls
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search inquiries..."
        filterContent={
          <Select
            value={inquiryQuery.status}
            onValueChange={(value) => {
              setInquiryQuery((prev) => ({
                ...prev,
                status: value,
                page: 1,
              }));
            }}
          >
            <SelectTrigger className="rounded-none rounded-r-xl border-0 border-l border-gray-200 bg-transparent shadow-none hover:bg-gray-100 h-[42px] w-[42px] px-0 flex items-center justify-center cursor-pointer [&>svg]:hidden">
              <span className="flex items-center justify-center">
                <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({inquiries.length})</SelectItem>
              <SelectItem value="PENDING">Pending ({inquiries.filter((i) => i.status === "PENDING").length})</SelectItem>
              <SelectItem value="REPLIED">Replied ({inquiries.filter((i) => i.status === "REPLIED").length})</SelectItem>
              <SelectItem value="CLOSED">Closed ({inquiries.filter((i) => i.status === "CLOSED").length})</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {selectedInquiries.size > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <BulkActionsToolbar
            selectedCount={selectedInquiries.size}
            totalCount={inquiries.length}
            onSelectAll={handleSelectAllInquiries}
            onDeselectAll={handleDeselectAllInquiries}
            onBulkActivate={handleInquiryBulkActivate}
            onBulkDeactivate={handleInquiryBulkSuspend}
            onBulkDelete={handleInquiryBulkDelete}
          />
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-300 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50 border-b border-gray-200">
              <TableRow>
                <TableHead className="w-12 text-gray-700 font-medium">
                  <Checkbox
                    checked={inquiries.filter((inquiry) => {
                      const matchesSearch = inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) || inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) || inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesStatus = inquiryQuery.status === "all" || inquiry.status === inquiryQuery.status;
                      return matchesSearch && matchesStatus;
                    }).length > 0 && inquiries.filter((inquiry) => {
                      const matchesSearch = inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) || inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) || inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesStatus = inquiryQuery.status === "all" || inquiry.status === inquiryQuery.status;
                      return matchesSearch && matchesStatus;
                    }).every((i) => selectedInquiries.has(i.id))}
                    onCheckedChange={(checked) => {
                      if (checked) handleSelectAllInquiries();
                      else handleDeselectAllInquiries();
                    }}
                    className="border-gray-400"
                  />
                </TableHead>
                <TableHead className="w-14 text-gray-700 font-medium">SN.</TableHead>
                <TableHead className="text-gray-700 font-medium">Customer</TableHead>
                <TableHead className="text-gray-700 font-medium">Business</TableHead>
                <TableHead className="text-gray-700 font-medium">Message</TableHead>
                <TableHead className="text-center text-gray-700 font-medium">Status</TableHead>
                <TableHead className="text-gray-700 font-medium">Date</TableHead>
                <TableHead className="text-center text-gray-700 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inquiries
                .filter((inquiry) => {
                  const matchesSearch =
                    inquiry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    inquiry.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    inquiry.message?.toLowerCase().includes(searchTerm.toLowerCase());
                  const matchesStatus = inquiryQuery.status === "all" || inquiry.status === inquiryQuery.status;
                  return matchesSearch && matchesStatus;
                })
                .map((inquiry, index) => (
                  <TableRow key={inquiry.id} className="hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedInquiries.has(inquiry.id)}
                        onCheckedChange={() => {
                          const newSet = new Set(selectedInquiries);
                          if (newSet.has(inquiry.id)) {
                            newSet.delete(inquiry.id);
                          } else {
                            newSet.add(inquiry.id);
                          }
                        }}
                        className="border-gray-400"
                      />
                    </TableCell>
                    <TableCell className="text-gray-500 font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{inquiry.name}</div>
                          <div className="text-sm text-gray-500">{inquiry.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{inquiry.business?.name || "N/A"}</TableCell>
                    <TableCell className="text-gray-600 max-w-xs truncate">{inquiry.message}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <StatusBadge
                          status={inquiry.status}
                          variant={inquiry.status === "PENDING" ? "warning" : inquiry.status === "REPLIED" ? "success" : "neutral"}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-1">
                        <AdminActionIconButton onClick={() => handleViewInquiry(inquiry)} title="View Details">
                          <Eye className="h-4 w-4 text-gray-500" />
                        </AdminActionIconButton>
                        <AdminActionIconButton onClick={() => handleReplyInquiry(inquiry)} title="Reply">
                          <Mail className="h-4 w-4 text-gray-500" />
                        </AdminActionIconButton>
                        <AdminActionIconButton onClick={() => handleDeleteInquiry(inquiry)} title="Delete" tone="danger">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </AdminActionIconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>

        {inquiries.length === 0 && (
          <AdminEmptyState
            icon={<MessageSquare className="h-8 w-8 text-gray-400" />}
            title="No inquiries found"
            description={searchTerm ? "Try adjusting your search" : "There are no customer inquiries yet"}
          />
        )}

        {inquiries.length > 0 && (
          <div className="p-2 border-t">
            <Pagination
              currentPage={inquiryPagination?.page || 1}
              totalPages={inquiryPagination?.totalPages || 1}
              totalItems={inquiries.length}
              itemsPerPage={inquiryPagination?.limit || 10}
              onPageChange={(page) => setInquiryQuery((prev) => ({ ...prev, page }))}
              onItemsPerPageChange={(limit) => setInquiryQuery((prev) => ({ ...prev, limit, page: 1 }))}
            />
          </div>
        )}
      </div>
    </div>
  );
}
