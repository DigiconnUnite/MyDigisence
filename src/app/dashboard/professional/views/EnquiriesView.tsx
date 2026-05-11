"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Search, MessageSquare, Mail, Phone, Calendar, Clock, 
  CheckCircle2, Reply, MoreHorizontal, Filter, ArrowLeft
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "new" | "contacted" | "replied" | "closed";
  createdAt: string;
  avatar?: string;
  service?: string;
}

interface EnquiriesViewProps {
  enquiries?: Enquiry[];
  isLoading?: boolean;
}

const defaultEnquiries: Enquiry[] = [
  { id: "1", name: "Vikram Mahto", email: "vikram@example.com", subject: "Web Development Project", message: "Interested in building an e-commerce platform. Would like to discuss requirements and pricing.", status: "new", createdAt: "2024-05-20T10:30:00", service: "Web Development" },
  { id: "2", name: "Pooja Patel", email: "pooja@example.com", phone: "+91 98765 12345", subject: "Social Media Marketing", message: "Looking for someone to manage our company's social media presence across Instagram and LinkedIn.", status: "new", createdAt: "2024-05-20T09:15:00", service: "Marketing" },
  { id: "3", name: "Amit Kumar", email: "amit@example.com", subject: "Collaboration Opportunity", message: "I have a project idea and would love to collaborate with you. Please let me know your availability.", status: "contacted", createdAt: "2024-05-19T14:20:00" },
  { id: "4", name: "Sunil Yadav", email: "sunil@example.com", subject: "SEO Services", message: "Need help with SEO optimization for our website. Currently ranking low on Google search results.", status: "contacted", createdAt: "2024-05-19T11:00:00", service: "SEO" },
  { id: "5", name: "Ritika Singh", email: "ritika@example.com", subject: "Content Marketing Inquiry", message: "Looking for content marketing strategy for our startup. Please share your portfolio and pricing.", status: "replied", createdAt: "2024-05-18T16:45:00", service: "Content Marketing" },
];

const statusConfig = {
  new: { label: "New", className: "bg-green-100 text-green-700" },
  contacted: { label: "Contacted", className: "bg-blue-100 text-blue-700" },
  replied: { label: "Replied", className: "bg-purple-100 text-purple-700" },
  closed: { label: "Closed", className: "bg-gray-100 text-gray-600" },
};

export default function EnquiriesView({ enquiries, isLoading = false }: EnquiriesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Enquiry["status"]>("all");
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [replyText, setReplyText] = useState("");

  const data = enquiries || defaultEnquiries;

  const filteredEnquiries = data.filter(e => 
    (statusFilter === "all" || e.status === statusFilter) &&
    (e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
     e.message.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = {
    total: data.length,
    new: data.filter(e => e.status === "new").length,
    contacted: data.filter(e => e.status === "contacted").length,
    replied: data.filter(e => e.status === "replied").length,
  };

  const handleReply = () => {
    // Handle reply logic
    setReplyText("");
    setSelectedEnquiry(null);
  };

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-gray-200 rounded-xl" />
        <div className="h-96 bg-gray-200 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
        <p className="text-sm text-gray-500 mt-1">Manage client inquiries and messages</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Enquiries", value: stats.total },
          { label: "New", value: stats.new, color: "text-green-600" },
          { label: "Contacted", value: stats.contacted, color: "text-blue-600" },
          { label: "Replied", value: stats.replied, color: "text-purple-600" },
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={cn("text-2xl font-bold", stat.color || "text-gray-900")}>{stat.value}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search enquiries..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                {statusFilter === "all" ? "All Status" : statusConfig[statusFilter].label}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("new")}>New</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("contacted")}>Contacted</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("replied")}>Replied</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("closed")}>Closed</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      {/* Enquiries List */}
      <Card>
        <div className="divide-y">
          {filteredEnquiries.map((enquiry) => (
            <div 
              key={enquiry.id} 
              className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setSelectedEnquiry(enquiry)}
            >
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                  {enquiry.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{enquiry.name}</h3>
                  <Badge className={cn("text-xs", statusConfig[enquiry.status].className)}>
                    {statusConfig[enquiry.status].label}
                  </Badge>
                  {enquiry.service && (
                    <Badge variant="outline" className="text-xs">{enquiry.service}</Badge>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-800">{enquiry.subject}</p>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{enquiry.message}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {enquiry.email}
                  </span>
                  {enquiry.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {enquiry.phone}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {new Date(enquiry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedEnquiry(enquiry)}>
                <Reply className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Reply Dialog */}
      <Dialog open={!!selectedEnquiry} onOpenChange={() => setSelectedEnquiry(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enquiry Details</DialogTitle>
          </DialogHeader>
          {selectedEnquiry && (
            <div className="space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {selectedEnquiry.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedEnquiry.name}</h3>
                  <p className="text-sm text-gray-500">{selectedEnquiry.email}</p>
                  {selectedEnquiry.phone && <p className="text-sm text-gray-500">{selectedEnquiry.phone}</p>}
                  <Badge className={cn("mt-2", statusConfig[selectedEnquiry.status].className)}>
                    {statusConfig[selectedEnquiry.status].label}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">{selectedEnquiry.subject}</h4>
                <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{selectedEnquiry.message}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Your Reply</label>
                <Textarea
                  placeholder="Type your response..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setSelectedEnquiry(null)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleReply} disabled={!replyText.trim()}>
                  <Reply className="h-4 w-4 mr-2" />
                  Send Reply
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
