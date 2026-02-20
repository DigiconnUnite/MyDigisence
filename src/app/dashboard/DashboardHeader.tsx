"use client";

import React from "react";
import { Shield } from "lucide-react";
import { AuthUser } from "@/lib/auth";

interface DashboardHeaderProps {
  title: string;
  user: AuthUser | null;
  role: "SUPER_ADMIN" | "BUSINESS_ADMIN" | "PROFESSIONAL_ADMIN";
  socketConnected?: boolean;
}

export default function DashboardHeader({
  title,
  user,
  role,
  socketConnected,
}: DashboardHeaderProps) {
  return (
    <div className="bg-white border border-gray-200 shadow-sm">
      <div className="flex justify-between items-center px-3 sm:px-4 py-3">
        <div className="flex items-center">
          <img src="/logo.png" alt="DigiSense" className="h-8 w-auto" />
          <span className="h-8 border-l border-gray-300 mx-2"></span>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">
              {title}
            </h1>
          </div>
        </div>

        <div className="flex items-center leading-tight space-x-2 sm:space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.name || "User"}
            </p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <span className="h-8 border-l border-gray-300 mx-2"></span>
          <div className="flex items-center space-x-2">
            {role === "SUPER_ADMIN" && (
              <div
                className={`w-3 h-3 rounded-full ${
                  socketConnected ? "bg-green-500" : "bg-red-500"
                }`}
                title={
                  socketConnected
                    ? "Real-time connected"
                    : "Real-time disconnected"
                }
              ></div>
            )}
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <Shield className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
