"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar, Clock, Video, MapPin, CheckCircle2, XCircle, 
  ChevronLeft, ChevronRight, MoreHorizontal, Plus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  duration: string;
  type: "video" | "in-person" | "phone";
  status: "upcoming" | "completed" | "cancelled";
  notes?: string;
}

interface AppointmentsViewProps {
  appointments?: Appointment[];
  isLoading?: boolean;
}

const defaultAppointments: Appointment[] = [
  { id: "1", clientName: "Rahul Sharma", service: "Web Development Consultation", date: "2024-05-22", time: "10:00 AM", duration: "1 hour", type: "video", status: "upcoming" },
  { id: "2", clientName: "Priya Patel", service: "Project Discussion", date: "2024-05-22", time: "2:00 PM", duration: "30 min", type: "phone", status: "upcoming" },
  { id: "3", clientName: "Amit Kumar", service: "Website Review", date: "2024-05-21", time: "11:00 AM", duration: "45 min", type: "video", status: "completed" },
  { id: "4", clientName: "Sneha Gupta", service: "Strategy Meeting", date: "2024-05-20", time: "3:00 PM", duration: "1 hour", type: "in-person", status: "completed" },
  { id: "5", clientName: "Vikram Singh", service: "Technical Discussion", date: "2024-05-19", time: "10:30 AM", duration: "30 min", type: "phone", status: "cancelled" },
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AppointmentsView({ appointments, isLoading = false }: AppointmentsViewProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<"upcoming" | "completed" | "cancelled" | "all">("upcoming");

  const data = appointments || defaultAppointments;
  const filteredAppointments = data.filter(a => view === "all" || a.status === view);

  const stats = {
    upcoming: data.filter(a => a.status === "upcoming").length,
    completed: data.filter(a => a.status === "completed").length,
    cancelled: data.filter(a => a.status === "cancelled").length,
    today: data.filter(a => a.date === new Date().toISOString().split("T")[0]).length,
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(selectedDate);
  const monthName = selectedDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const statusConfig = {
    upcoming: { label: "Upcoming", className: "bg-blue-100 text-blue-700" },
    completed: { label: "Completed", className: "bg-green-100 text-green-700" },
    cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700" },
  };

  const typeIcons = {
    video: Video,
    "in-person": MapPin,
    phone: Clock,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your schedule and bookings</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Appointment
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Upcoming", value: stats.upcoming, color: "text-blue-600" },
          { label: "Completed", value: stats.completed, color: "text-green-600" },
          { label: "Cancelled", value: stats.cancelled, color: "text-red-600" },
          { label: "Today", value: stats.today, color: "text-purple-600" },
        ].map((stat, i) => (
          <Card key={i} className="p-4">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className={cn("text-2xl font-bold", stat.color)}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">{monthName}</h3>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map(d => (
              <div key={d} className="text-center text-xs text-gray-500 py-2">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const isToday = day === new Date().getDate();
              return (
                <button
                  key={day}
                  className={cn(
                    "h-10 w-10 rounded-lg text-sm flex items-center justify-center transition-colors",
                    isToday ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t space-y-2">
            <h4 className="font-medium text-sm text-gray-900">Quick Stats</h4>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">This Week</span>
              <span className="font-medium">8 appointments</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">This Month</span>
              <span className="font-medium">24 appointments</span>
            </div>
          </div>
        </Card>

        {/* Appointments List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2">
            {["upcoming", "completed", "cancelled", "all"].map((v) => (
              <Button
                key={v}
                variant={view === v ? "default" : "outline"}
                size="sm"
                onClick={() => setView(v as typeof view)}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </Button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredAppointments.map((apt) => {
              const TypeIcon = typeIcons[apt.type];
              return (
                <Card key={apt.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center min-w-[60px]">
                      <span className="text-sm text-gray-500">
                        {new Date(apt.date).toLocaleDateString("en-US", { month: "short" })}
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        {new Date(apt.date).getDate()}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900">{apt.clientName}</h3>
                          <Badge className={cn("text-xs", statusConfig[apt.status].className)}>
                            {statusConfig[apt.status].label}
                          </Badge>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {apt.status === "upcoming" && (
                              <>
                                <DropdownMenuItem><CheckCircle2 className="h-4 w-4 mr-2" /> Complete</DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600"><XCircle className="h-4 w-4 mr-2" /> Cancel</DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem>Reschedule</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-sm text-gray-600 mt-1">{apt.service}</p>

                      <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {apt.time} ({apt.duration})
                        </span>
                        <span className="flex items-center gap-1">
                          <TypeIcon className="h-4 w-4" />
                          {apt.type.charAt(0).toUpperCase() + apt.type.slice(1)}
                        </span>
                      </div>

                      {apt.status === "upcoming" && (
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" variant="outline">
                            <Video className="h-4 w-4 mr-2" />
                            Join
                          </Button>
                          <Button size="sm" variant="outline">Reschedule</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
