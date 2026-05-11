"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Handshake,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Calendar,
  DollarSign,
  User,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Send,
  Archive,
  Flag,
  Star,
  ExternalLink,
  FileText,
  Briefcase,
  TrendingUp,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ServiceRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  service: string;
  category: string;
  budget: string;
  timeline: string;
  description: string;
  status: "pending" | "accepted" | "rejected" | "completed" | "archived";
  priority: "low" | "medium" | "high" | "urgent";
  submittedAt: string;
  lastUpdated: string;
  deadline?: string;
  estimatedValue?: number;
  clientLocation?: string;
  attachments?: Array<{
    name: string;
    url: string;
    size: number;
  }>;
  messages?: Array<{
    id: string;
    sender: "client" | "professional";
    content: string;
    timestamp: string;
  }>;
}

interface ServiceRequestsViewProps {
  isLoading?: boolean;
}


const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
  archived: "bg-gray-100 text-gray-800",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-800",
  medium: "bg-blue-100 text-blue-800",
  high: "bg-orange-100 text-orange-800",
  urgent: "bg-red-100 text-red-800",
};

export default function ServiceRequestsView({ isLoading: initialLoading = false }: ServiceRequestsViewProps) {
  const { toast } = useToast();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const [error, setError] = useState<string | null>(null);

  // Fetch service requests from API
  useEffect(() => {
    const fetchServiceRequests = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.append("status", statusFilter);
        if (priorityFilter !== "all") params.append("priority", priorityFilter);
        if (searchTerm) params.append("search", searchTerm);

        const response = await fetch(`/api/professionals/service-requests?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch service requests");
        }
        const data = await response.json();
        setRequests(data.serviceRequests || []);
      } catch (err) {
        console.error("Error fetching service requests:", err);
        setError("Failed to load service requests. Please try again.");
        toast({
          title: "Error",
          description: "Failed to load service requests",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchServiceRequests();
  }, [statusFilter, priorityFilter, searchTerm, toast]);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === "" || 
      request.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusUpdate = async (requestId: string, newStatus: ServiceRequest['status']) => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/professionals/service-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: requestId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const data = await response.json();
      
      setRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, status: newStatus, lastUpdated: new Date().toISOString() }
          : request
      ));
      
      setShowDetailsDialog(false);
      toast({
        title: "Status Updated",
        description: `Service request status has been updated to ${newStatus}.`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageContent.trim() || !selectedRequest) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch('/api/professionals/service-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: selectedRequest.id, 
          message: messageContent 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const newMessage = {
        id: Date.now().toString(),
        sender: "professional" as const,
        content: messageContent,
        timestamp: new Date().toISOString()
      };
      
      setRequests(prev => prev.map(request => 
        request.id === selectedRequest.id 
          ? { 
              ...request, 
              messages: [...(request.messages || []), newMessage],
              lastUpdated: new Date().toISOString()
            }
          : request
      ));
      
      setMessageContent("");
      setShowMessageDialog(false);
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the client.",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleArchive = async (requestId: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/professionals/service-requests', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: requestId, status: 'archived' }),
      });

      if (!response.ok) {
        throw new Error('Failed to archive request');
      }
      
      setRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, status: "archived", lastUpdated: new Date().toISOString() }
          : request
      ));
      
      toast({
        title: "Request Archived",
        description: "Service request has been archived.",
      });
    } catch (error) {
      console.error('Error archiving request:', error);
      toast({
        title: "Error",
        description: "Failed to archive request.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const viewRequestDetails = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowDetailsDialog(true);
  };

  const openMessageDialog = (request: ServiceRequest) => {
    setSelectedRequest(request);
    setShowMessageDialog(true);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
            <p className="text-sm text-gray-500 mt-1">Manage client service requests and proposals</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === "pending").length,
    accepted: requests.filter(r => r.status === "accepted").length,
    completed: requests.filter(r => r.status === "completed").length,
    totalValue: requests.reduce((sum, r) => sum + (r.estimatedValue || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Manage client service requests and proposals</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Handshake className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.pending}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Accepted</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.accepted}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.completed}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(stats.totalValue)}
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{request.clientName}</div>
                        <div className="text-sm text-gray-500">{request.clientEmail}</div>
                        {request.clientLocation && (
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                            {request.clientLocation}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{request.service}</div>
                        <div className="text-sm text-gray-500">{request.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{request.budget}</div>
                        {request.estimatedValue && (
                          <div className="text-sm text-green-600">
                            Est: {formatCurrency(request.estimatedValue)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(statusColors[request.status])}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(priorityColors[request.priority])}>
                        {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{formatDate(request.submittedAt)}</div>
                        {request.deadline && (
                          <div className="text-xs text-orange-600 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Due: {formatDate(request.deadline)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => viewRequestDetails(request)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openMessageDialog(request)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {request.status === "pending" && (
                            <>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(request.id, "accepted")}>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Accept
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusUpdate(request.id, "rejected")}>
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </DropdownMenuItem>
                            </>
                          )}
                          {request.status === "accepted" && (
                            <DropdownMenuItem onClick={() => handleStatusUpdate(request.id, "completed")}>
                              <Star className="h-4 w-4 mr-2" />
                              Mark Complete
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleArchive(request.id)}>
                            <Archive className="h-4 w-4 mr-2" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Handshake className="h-5 w-5" />
              Service Request Details
            </DialogTitle>
            <DialogDescription>
              Review the complete service request information
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-6">
              {/* Client Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Client Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{selectedRequest.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{selectedRequest.clientEmail}</span>
                    </div>
                    {selectedRequest.clientPhone && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">{selectedRequest.clientPhone}</span>
                      </div>
                    )}
                    {selectedRequest.clientLocation && (
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                        <span className="text-sm text-gray-500">{selectedRequest.clientLocation}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Request Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Service:</span>
                      <span className="font-medium">{selectedRequest.service}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Category:</span>
                      <span>{selectedRequest.category}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Budget:</span>
                      <span className="font-medium">{selectedRequest.budget}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Timeline:</span>
                      <span>{selectedRequest.timeline}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <Badge className={statusColors[selectedRequest.status]}>
                        {selectedRequest.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Priority:</span>
                      <Badge className={priorityColors[selectedRequest.priority]}>
                        {selectedRequest.priority}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Project Description</h3>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {selectedRequest.description}
                </p>
              </div>

              {/* Attachments */}
              {selectedRequest.attachments && selectedRequest.attachments.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Attachments</h3>
                  <div className="space-y-2">
                    {selectedRequest.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="font-medium">{attachment.name}</div>
                            <div className="text-sm text-gray-500">
                              {(attachment.size / 1024 / 1024).toFixed(2)} MB
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages */}
              {selectedRequest.messages && selectedRequest.messages.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Communication History</h3>
                  <div className="space-y-3">
                    {selectedRequest.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "p-3 rounded-lg",
                          message.sender === "client" ? "bg-blue-50 ml-8" : "bg-gray-50 mr-8"
                        )}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">
                            {message.sender === "client" ? selectedRequest.clientName : "You"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatDate(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex gap-3">
                  {selectedRequest.status === "pending" && (
                    <>
                      <Button
                        onClick={() => handleStatusUpdate(selectedRequest.id, "accepted")}
                        disabled={isUpdating}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept Request
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleStatusUpdate(selectedRequest.id, "rejected")}
                        disabled={isUpdating}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Request
                      </Button>
                    </>
                  )}
                  {selectedRequest.status === "accepted" && (
                    <Button
                      onClick={() => handleStatusUpdate(selectedRequest.id, "completed")}
                      disabled={isUpdating}
                    >
                      <Star className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => openMessageDialog(selectedRequest)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleArchive(selectedRequest.id)}
                    disabled={isUpdating}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Send Message
            </DialogTitle>
            <DialogDescription>
              Send a message to {selectedRequest?.clientName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message here..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} disabled={!messageContent.trim() || isUpdating}>
              <Send className="h-4 w-4 mr-2" />
              {isUpdating ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
