"use client";

import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type { UserRole } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Image from "next/image";

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="bg-white border rounded-3xl mt-3 mx-3 border-gray-200 shadow-sm">
      <div className="flex justify-between items-center px-3 sm:px-4 py-2">
        <div className="flex items-center">
          <Image src="/logo.png" alt="DigiSence" width={32} height={32} className="h-8 w-auto" />
          <span className="h-8 border-l border-gray-300 mx-2"></span>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Professional Dashboard
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">
              {user?.name || "Professional"}
            </p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <span className="h-8 border-l border-gray-300 mx-2"></span>
          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-amber-600 rounded-2xl flex items-center justify-center">
            <User className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="ml-2 hidden sm:flex"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Header;