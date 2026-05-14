"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, Search, Edit2, Trash2, Eye, FolderKanban, MoreHorizontal,
  Filter, Grid3X3, List
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description?: string;
  image?: string | null;
  technologies?: string[];
  status?: "completed" | "in-progress" | "planned";
  views?: number;
  likes?: number;
  createdAt?: string;
}

interface PortfolioItem {
  title?: string;
  description?: string;
  url?: string;
}

interface ProjectsViewProps {
  projects?: Project[];
  portfolio?: PortfolioItem[];
  isLoading?: boolean;
  onAddProject?: () => void;
  onEditProject?: (id: string) => void;
  onDeleteProject?: (id: string) => void;
  onViewProject?: (id: string) => void;
}

export default function ProjectsView({
  projects,
  portfolio,
  isLoading = false,
  onAddProject,
  onEditProject,
  onDeleteProject,
  onViewProject,
}: ProjectsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "in-progress" | "planned">("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const data: Project[] = projects
    ?? (portfolio || []).map((item, index) => ({
      id: `portfolio-${index}`,
      title: item.title || `Project ${index + 1}`,
      description: item.description || "",
      image: item.url || null,
      status: "completed",
      views: 0,
      likes: 0,
    }));

  const filteredProjects = data.filter(p => 
    (statusFilter === "all" || (p.status || "completed") === statusFilter) &&
    (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     (p.technologies || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const stats = {
    total: data.length,
    completed: data.filter(p => (p.status || "completed") === "completed").length,
    inProgress: data.filter(p => p.status === "in-progress").length,
    planned: data.filter(p => p.status === "planned").length,
    totalViews: data.reduce((acc, p) => acc + (p.views || 0), 0),
  };

  const statusConfig = {
    completed: { label: "Completed", className: "bg-green-100 text-green-700" },
    "in-progress": { label: "In Progress", className: "bg-blue-100 text-blue-700" },
    planned: { label: "Planned", className: "bg-gray-100 text-gray-600" },
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
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="text-sm text-gray-500 mt-1">Showcase your work and portfolio</p>
        </div>
        <Button onClick={onAddProject}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Projects", value: stats.total },
          { label: "Completed", value: stats.completed, color: "text-green-600" },
          { label: "In Progress", value: stats.inProgress, color: "text-blue-600" },
          { label: "Planned", value: stats.planned, color: "text-gray-600" },
          { label: "Total Views", value: stats.totalViews.toLocaleString() },
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
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  {statusFilter === "all" ? "All Status" : statusConfig[statusFilter].label}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Status</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("completed")}>Completed</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("in-progress")}>In Progress</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("planned")}>Planned</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="flex border rounded-md overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="rounded-none"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="rounded-none"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <Card className="p-6 text-sm text-gray-500">No projects found.</Card>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const status = statusConfig[project.status ?? "completed"];
            const technologies = project.technologies || [];

            return (
              <Card key={project.id} className="overflow-hidden group">
                <div className="relative h-48 bg-linear-to-br from-slate-200 to-slate-300">
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <Badge className={cn("text-xs", status.className)}>
                      {status.label}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-semibold text-white text-lg">{project.title}</h3>
                    <p className="text-sm text-white/80 line-clamp-1">{project.description || ""}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {technologies.slice(0, 3).map((tech, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">{tech}</Badge>
                    ))}
                    {technologies.length > 3 && (
                      <Badge variant="secondary" className="text-xs">+{technologies.length - 3}</Badge>
                    )}
                    {technologies.length === 0 && (
                      <Badge variant="secondary" className="text-xs">Portfolio</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{(project.views || 0).toLocaleString()} views</span>
                    <span>{project.likes || 0} likes</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewProject?.(project.id)}>
                      <Eye className="h-4 w-4 mr-2" /> View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => onEditProject?.(project.id)}>
                      <Edit2 className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <div className="divide-y">
            {filteredProjects.map((project) => {
              const status = statusConfig[project.status ?? "completed"];
              const technologies = project.technologies || [];

              return (
                <div key={project.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <div className="h-16 w-16 bg-linear-to-br from-slate-200 to-slate-300 rounded-lg flex items-center justify-center shrink-0">
                    <FolderKanban className="h-8 w-8 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{project.title}</h3>
                      <Badge className={cn("text-xs", status.className)}>
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{project.description || ""}</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {technologies.length === 0 ? (
                        <span className="text-xs text-gray-400">Portfolio item</span>
                      ) : (
                        technologies.map((tech, i) => (
                          <span key={i} className="text-xs text-gray-400">{tech}{i < technologies.length - 1 ? " • " : ""}</span>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{(project.views || 0).toLocaleString()} views</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewProject?.(project.id)}>
                          <Eye className="h-4 w-4 mr-2" /> View
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onEditProject?.(project.id)}>
                          <Edit2 className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDeleteProject?.(project.id)} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
