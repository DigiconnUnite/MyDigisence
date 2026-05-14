"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  description?: string;
  image?: string | null;
  technologies?: string[];
  status?: "completed" | "in-progress";
}

interface PortfolioItem {
  title?: string;
  description?: string;
  url?: string;
}

interface MyProjectsProps {
  projects?: Project[];
  portfolio?: PortfolioItem[];
  isLoading?: boolean;
  onViewAll?: () => void;
}

const statusConfig = {
  completed: { label: "Completed", className: "bg-green-100 text-green-700" },
  "in-progress": { label: "In Progress", className: "bg-blue-100 text-blue-700" },
};

export default function MyProjects({
  projects,
  portfolio,
  isLoading = false,
  onViewAll,
}: MyProjectsProps) {
  const data: Project[] = projects
    ?? (portfolio || []).map((item, index) => ({
      id: `portfolio-${index}`,
      title: item.title || `Project ${index + 1}`,
      description: item.description || "",
      image: item.url || null,
      status: "completed",
    }));

  if (isLoading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="h-6 w-24 bg-gray-200 rounded" />
          <div className="h-4 w-16 bg-gray-200 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4">
              <div className="h-32 bg-gray-200 rounded-lg mb-3" />
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-3 w-48 bg-gray-200 rounded mb-3" />
              <div className="h-5 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">My Projects</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Showcase of your recent work
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onViewAll}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          View All
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.length === 0 ? (
          <div className="col-span-full rounded-lg border border-dashed border-gray-200 p-4 text-sm text-gray-500">
            No projects yet. Add portfolio items to showcase your work.
          </div>
        ) : (
          data.map((project) => {
            const status = statusConfig[project.status ?? "completed"];

            return (
              <div
                key={project.id}
                className="group bg-gray-50 rounded-lg overflow-hidden hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="relative h-32 bg-linear-to-br from-slate-200 to-slate-300">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <Badge
                      className={cn(
                        "text-xs font-medium px-2 py-0.5",
                        status.className
                      )}
                    >
                      {status.label}
                    </Badge>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {project.description || project.technologies?.join(", ") || "Project details"}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
