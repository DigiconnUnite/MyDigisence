import { Calendar, Eye, FileText, Mail, Package, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { BusinessStats, Inquiry } from "../types";

interface BusinessInquiriesSectionProps {
  inquiries: Inquiry[];
  stats: BusinessStats;
  formatDate: (dateString: string) => string;
  onStatusUpdate: (inquiryId: string, status: Inquiry["status"]) => void;
}

export function BusinessInquiriesSection({
  inquiries,
  stats,
  formatDate,
  onStatusUpdate,
}: BusinessInquiriesSectionProps) {
  return (
    <div className=" mx-auto">
      <div className="mb-8">
        <h1 className="text-lg font-bold text-gray-900">Customer Inquiries</h1>
        <p className="text-md text-gray-600">View and respond to customer inquiries</p>
      </div>

      {inquiries.length === 0 ? (
        <Card className="rounded-3xl">
          <CardContent className="text-center py-12">
            <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
            <p className="text-gray-600">
              Customer inquiries will appear here when people contact you
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Total</CardTitle>
                <Mail className="h-4 w-4 text-gray-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.totalInquiries}</div>
                <p className="text-xs text-gray-500">All inquiries</p>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">New</CardTitle>
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.newInquiries}</div>
                <p className="text-xs text-gray-500">Awaiting review</p>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Read</CardTitle>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.readInquiries}</div>
                <p className="text-xs text-gray-500">Viewed</p>
              </CardContent>
            </Card>
            <Card className="bg-white border border-gray-200 shadow-sm rounded-3xl transition-all duration-300 hover:shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Replied</CardTitle>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.repliedInquiries}</div>
                <p className="text-xs text-gray-500">Response sent</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {inquiries.slice(0, 10).map((inquiry) => (
              <Card
                key={inquiry.id}
                className="border-l-4 border-l-blue-500 rounded-3xl transition-all duration-300 hover:shadow-lg"
              >
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-lg">{inquiry.name}</h4>
                        <div
                          className={`flex items-center gap-1.5 px-1.5 w-fit py-0.5 rounded-full border text-xs font-medium ${
                            inquiry.status === "NEW"
                              ? "bg-red-500/10 border-red-500/30 text-red-600"
                              : inquiry.status === "READ"
                                ? "bg-blue-500/10 border-blue-500/30 text-blue-700"
                                : inquiry.status === "REPLIED"
                                  ? "bg-green-500/10 border-green-500/30 text-green-700"
                                  : "bg-gray-500/10 border-gray-500/30 text-gray-600"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              inquiry.status === "NEW"
                                ? "bg-red-500"
                                : inquiry.status === "READ"
                                  ? "bg-blue-500"
                                  : inquiry.status === "REPLIED"
                                    ? "bg-green-500"
                                    : "bg-gray-500"
                            }`}
                          ></span>
                          {inquiry.status === "NEW"
                            ? "New"
                            : inquiry.status === "READ"
                              ? "Read"
                              : inquiry.status === "REPLIED"
                                ? "Replied"
                                : "Closed"}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <a href={`mailto:${inquiry.email}`} className="text-blue-600 hover:underline">
                            {inquiry.email}
                          </a>
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${inquiry.phone}`} className="text-blue-600 hover:underline">
                              {inquiry.phone}
                            </a>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(inquiry.createdAt)}</span>
                      </div>
                    </div>
                    {inquiry.product && (
                      <div className="flex items-center space-x-2 mt-2">
                        <Package className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Regarding: <strong>{inquiry.product.name}</strong>
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mb-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
                    <Separator />

                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      {inquiry.status === "NEW" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onStatusUpdate(inquiry.id, "READ")}
                          className="rounded-xl"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Mark as Read
                        </Button>
                      )}
                      {(inquiry.status === "NEW" || inquiry.status === "READ") && (
                        <Button
                          size="sm"
                          onClick={() => onStatusUpdate(inquiry.id, "REPLIED")}
                          className="rounded-xl"
                        >
                          <Mail className="h-4 w-4 mr-1" />
                          Mark as Replied
                        </Button>
                      )}
                      {(inquiry.status === "NEW" ||
                        inquiry.status === "READ" ||
                        inquiry.status === "REPLIED") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onStatusUpdate(inquiry.id, "CLOSED")}
                          className="rounded-xl"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Close
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
