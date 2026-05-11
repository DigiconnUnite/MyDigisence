"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Professional } from "../types/professional";

type EditableField = 
  | "name" 
  | "professionalHeadline" 
  | "aboutMe" 
  | "email" 
  | "phone" 
  | "location" 
  | "website" 
  | "facebook" 
  | "twitter" 
  | "instagram" 
  | "linkedin";

interface EditingState {
  isEditing: Record<EditableField, boolean>;
  values: Record<EditableField, string>;
}

interface UseProfileEditingReturn {
  editingState: EditingState;
  inputRefs: Record<EditableField, React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>>;
  startEditing: (field: EditableField, currentValue: string | null) => void;
  cancelEditing: (field: EditableField) => void;
  saveField: (field: EditableField, updateFn: (field: string, value: string) => Promise<boolean>) => Promise<void>;
  updateEditingValue: (field: EditableField, value: string) => void;
  isFieldEditing: (field: EditableField) => boolean;
  getEditingValue: (field: EditableField) => string;
}

export function useProfileEditing(
  professional: Professional | null
): UseProfileEditingReturn {
  // Create refs for all editable fields
  const nameInputRef = useRef<HTMLInputElement>(null);
  const headlineInputRef = useRef<HTMLInputElement>(null);
  const aboutMeInputRef = useRef<HTMLTextAreaElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const locationInputRef = useRef<HTMLInputElement>(null);
  const websiteInputRef = useRef<HTMLInputElement>(null);
  const facebookInputRef = useRef<HTMLInputElement>(null);
  const twitterInputRef = useRef<HTMLInputElement>(null);
  const instagramInputRef = useRef<HTMLInputElement>(null);
  const linkedinInputRef = useRef<HTMLInputElement>(null);

  const inputRefs: Record<EditableField, React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>> = {
    name: nameInputRef,
    professionalHeadline: headlineInputRef,
    aboutMe: aboutMeInputRef,
    email: emailInputRef,
    phone: phoneInputRef,
    location: locationInputRef,
    website: websiteInputRef,
    facebook: facebookInputRef,
    twitter: twitterInputRef,
    instagram: instagramInputRef,
    linkedin: linkedinInputRef,
  };

  const [editingState, setEditingState] = useState<EditingState>({
    isEditing: {
      name: false,
      professionalHeadline: false,
      aboutMe: false,
      email: false,
      phone: false,
      location: false,
      website: false,
      facebook: false,
      twitter: false,
      instagram: false,
      linkedin: false,
    },
    values: {
      name: "",
      professionalHeadline: "",
      aboutMe: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
  });

  // Focus management effect
  useEffect(() => {
    (Object.keys(editingState.isEditing) as EditableField[]).forEach((field) => {
      if (editingState.isEditing[field] && inputRefs[field].current) {
        inputRefs[field].current?.focus();
      }
    });
  }, [editingState.isEditing]);

  const startEditing = useCallback((field: EditableField, currentValue: string | null) => {
    setEditingState((prev) => ({
      ...prev,
      isEditing: { ...prev.isEditing, [field]: true },
      values: { ...prev.values, [field]: currentValue || "" },
    }));
  }, []);

  const cancelEditing = useCallback((field: EditableField) => {
    setEditingState((prev) => ({
      ...prev,
      isEditing: { ...prev.isEditing, [field]: false },
      values: { ...prev.values, [field]: "" },
    }));
  }, []);

  const updateEditingValue = useCallback((field: EditableField, value: string) => {
    setEditingState((prev) => ({
      ...prev,
      values: { ...prev.values, [field]: value },
    }));
  }, []);

  const saveField = useCallback(async (
    field: EditableField,
    updateFn: (field: string, value: string) => Promise<boolean>
  ) => {
    const value = editingState.values[field];
    const success = await updateFn(field, value);
    if (success) {
      cancelEditing(field);
    }
  }, [editingState.values, cancelEditing]);

  const isFieldEditing = useCallback((field: EditableField) => {
    return editingState.isEditing[field];
  }, [editingState.isEditing]);

  const getEditingValue = useCallback((field: EditableField) => {
    return editingState.values[field];
  }, [editingState.values]);

  return {
    editingState,
    inputRefs,
    startEditing,
    cancelEditing,
    saveField,
    updateEditingValue,
    isFieldEditing,
    getEditingValue,
  };
}
