"use client";

import React from "react";
import { Eye } from "lucide-react";
import StatCard from "./StatCard";
import ActionCard from "./ActionCard";

interface Professional {
  id: string;
  name: string;
  slug: string;
  professionalHeadline: string | null;
  aboutMe: string | null;
  profilePicture: string | null;
  banner: string | null;
  resume: string | null;
  location: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  adminId: string;
}

interface Stats {
  totalInquiries: number;
  newInquiries: number;
  profileViews: number;
}

interface ThemeSettings {
  cardClass: string;
  buttonStyle: string;
  gap: string;
}

interface OverviewViewProps {
  professional: Professional | null;
  stats: Stats;
  themeSettings: ThemeSettings;
  setCurrentView: (view: string) => void;
}

export default function OverviewView({
  professional,
  stats,
  themeSettings,
  setCurrentView,
}: OverviewViewProps) {
  return (
    <div
      className={`space-y-6 pb-20 md:pb-0 animate-fadeIn ${themeSettings.gap}`}
    >
      <div className="mb-8">
        <h1 className="text-lg md:text-xl font-bold text-slate-800 mb-2">
          Professional Dashboard Overview
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Welcome back! Here's your professional profile overview.
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Profile Views"
          value={stats?.profileViews?.toString() || "0"}
          subtitle="This month"
          icon={<Eye className="h-4 w-4 text-gray-400" />}
        />
        <StatCard
          title="Profile Status"
          value={professional?.isActive ? "Active" : "Inactive"}
          subtitle="Current status"
          icon={<Eye className="h-4 w-4 text-gray-400" />}
        />
        <StatCard
          title="Profile URL"
          value={professional ? `/pcard/${professional.slug}` : "Not set"}
          subtitle="Your public profile"
          icon={<Eye className="h-4 w-4 text-gray-400" />}
          truncate
        />
        <StatCard
          title="Platform Health"
          value="Good"
          subtitle="System status"
          icon={<Eye className="h-4 w-4 text-gray-400" />}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ActionCard
          title="View My Profile"
          description="See how your professional profile appears to visitors"
          icon={<Eye className="h-5 w-5" />}
          buttonText="View Public Profile"
          buttonAction={() =>
            professional &&
            window.open(`/pcard/${professional.slug}`, "_blank")
          }
          disabled={!professional}
        />
        <ActionCard
          title="Edit Profile"
          description="Update your professional information and portfolio"
          icon={<Eye className="h-5 w-5" />}
          buttonText="Edit Profile"
          buttonAction={() => setCurrentView("profile")}
          variant="outline"
        />
      </div>
    </div>
  );
}