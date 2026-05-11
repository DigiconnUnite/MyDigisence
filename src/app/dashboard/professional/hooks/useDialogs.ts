"use client";

import { useState, useCallback } from "react";
import { WorkExperience, Education, Service, PortfolioItem, Skill } from "../types/professional";

type DialogType = "experience" | "education" | "services" | "portfolio" | "skills" | null;

interface DialogFormData {
  experience: {
    position: string;
    company: string;
    location: string;
    startMonth: string;
    startYear: string;
    endMonth: string;
    endYear: string;
    isCurrent: boolean;
  };
  education: {
    degree: string;
    institution: string;
    year: string;
    description: string;
  };
  services: {
    name: string;
    description: string;
    price: string;
  };
  portfolio: {
    title: string;
    description: string;
    url: string;
  };
  skills: {
    name: string;
    level: "beginner" | "intermediate" | "expert" | "master";
  };
}

interface UseDialogsReturn {
  activeDialog: DialogType;
  editingIndex: number | null;
  formData: DialogFormData;
  skillSearchQuery: string;
  selectedSkillCategory: string;
  isEditingDialog: boolean;
  openDialog: (type: DialogType, index?: number, data?: Partial<DialogFormData[keyof DialogFormData]>) => void;
  closeDialog: () => void;
  updateFormData: (type: keyof DialogFormData, data: Partial<DialogFormData[keyof DialogFormData]>) => void;
  setSkillSearchQuery: (query: string) => void;
  setSelectedSkillCategory: (category: string) => void;
  setIsEditingDialog: (isEditing: boolean) => void;
  resetFormData: (type: keyof DialogFormData) => void;
}

const defaultFormData: DialogFormData = {
  experience: {
    position: "",
    company: "",
    location: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    isCurrent: false,
  },
  education: {
    degree: "",
    institution: "",
    year: "",
    description: "",
  },
  services: {
    name: "",
    description: "",
    price: "",
  },
  portfolio: {
    title: "",
    description: "",
    url: "",
  },
  skills: {
    name: "",
    level: "intermediate",
  },
};

export function useDialogs(): UseDialogsReturn {
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<DialogFormData>(defaultFormData);
  const [skillSearchQuery, setSkillSearchQuery] = useState("");
  const [selectedSkillCategory, setSelectedSkillCategory] = useState("all");
  const [isEditingDialog, setIsEditingDialog] = useState(false);

  const openDialog = useCallback((
    type: DialogType,
    index?: number,
    data?: Partial<DialogFormData[keyof DialogFormData]>
  ) => {
    setActiveDialog(type);
    setEditingIndex(index ?? null);
    setIsEditingDialog(!!data);
    
    if (type && data) {
      setFormData((prev) => ({
        ...prev,
        [type]: { ...prev[type], ...data },
      }));
    }
  }, []);

  const closeDialog = useCallback(() => {
    setActiveDialog(null);
    setEditingIndex(null);
    setIsEditingDialog(false);
  }, []);

  const updateFormData = useCallback((
    type: keyof DialogFormData,
    data: Partial<DialogFormData[keyof DialogFormData]>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: { ...prev[type], ...data },
    }));
  }, []);

  const resetFormData = useCallback((type: keyof DialogFormData) => {
    setFormData((prev) => ({
      ...prev,
      [type]: defaultFormData[type],
    }));
  }, []);

  return {
    activeDialog,
    editingIndex,
    formData,
    skillSearchQuery,
    selectedSkillCategory,
    isEditingDialog,
    openDialog,
    closeDialog,
    updateFormData,
    setSkillSearchQuery,
    setSelectedSkillCategory,
    setIsEditingDialog,
    resetFormData,
  };
}
