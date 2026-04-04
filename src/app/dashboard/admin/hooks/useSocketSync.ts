import { useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

interface SocketHandlers {
  setBusinesses: React.Dispatch<React.SetStateAction<any[]>>;
  setBusinessData: React.Dispatch<React.SetStateAction<any>>;
  setProfessionals: React.Dispatch<React.SetStateAction<any[]>>;
  setProfessionalData: React.Dispatch<React.SetStateAction<any>>;
  setRegistrationInquiries: React.Dispatch<React.SetStateAction<any[]>>;
  setStats: React.Dispatch<React.SetStateAction<any>>;
}

export function useSocketSync(
  socket: any,
  isConnected: boolean,
  handlers: SocketHandlers
) {
  const { toast } = useToast();
  const toastRef = useRef(toast);

  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const {
    setBusinesses,
    setBusinessData,
    setProfessionals,
    setProfessionalData,
    setRegistrationInquiries,
    setStats,
  } = handlers;

  // Memoize all handlers to prevent recreation on every render
  const handleBusinessCreated = useCallback((data: any) => {
    setBusinesses((prev: any[]) => [data.business, ...prev]);
    setBusinessData((prev: any) => prev ? {
      ...prev,
      businesses: [data.business, ...prev.businesses],
      pagination: {
        ...prev.pagination,
        totalItems: prev.pagination.totalItems + 1
      }
    } : null);
    setStats((prev: any) => ({
      ...prev,
      totalBusinesses: prev.totalBusinesses + 1,
      totalUsers: prev.totalUsers + 1,
    }));
    toastRef.current({
      title: "Business Created",
      description: `${data.business.name} has been added to the platform.`,
    });
  }, [setBusinesses, setBusinessData, setStats]);

  const handleBusinessUpdated = useCallback((data: any) => {
    setBusinesses((prev: any[]) => prev.map((biz: any) =>
      biz.id === data.business.id ? { ...biz, ...data.business } : biz
    ));
    setBusinessData((prev: any) => prev ? {
      ...prev,
      businesses: prev.businesses.map((biz: any) =>
        biz.id === data.business.id ? { ...biz, ...data.business } : biz
      )
    } : null);
    toastRef.current({
      title: "Business Updated",
      description: `${data.business.name} has been updated.`,
    });
  }, [setBusinesses, setBusinessData]);

  const handleBusinessDeleted = useCallback((data: any) => {
    setBusinesses(prev => prev.filter((biz: any) => biz.id !== data.businessId));
    setBusinessData((prev: any) => prev ? {
      ...prev,
      businesses: prev.businesses.filter((biz: any) => biz.id !== data.businessId),
      pagination: {
        ...prev.pagination,
        totalItems: Math.max(0, prev.pagination.totalItems - 1)
      }
    } : null);
    setStats((prev: any) => ({
      ...prev,
      totalBusinesses: Math.max(0, prev.totalBusinesses - 1),
      totalUsers: Math.max(0, prev.totalUsers - 1),
      activeBusinesses: data.isActive === true
        ? Math.max(0, prev.activeBusinesses - 1)
        : prev.activeBusinesses,
    }));
    toastRef.current({
      title: "Business Deleted",
      description: "A business has been removed from the platform.",
    });
  }, [setBusinesses, setBusinessData, setStats]);

  const handleBusinessStatusUpdated = useCallback((data: any) => {
    setBusinesses(prev => prev.map((biz: any) =>
      biz.id === data.business.id ? { ...biz, ...data.business } : biz
    ));
    setBusinessData((prev: any) => prev ? {
      ...prev,
      businesses: prev.businesses.map((biz: any) =>
        biz.id === data.business.id ? { ...biz, ...data.business } : biz
      )
    } : null);
    setStats((prev: any) => ({
      ...prev,
      activeBusinesses: data.business.isActive
        ? prev.activeBusinesses + 1
        : prev.activeBusinesses - 1,
    }));
    toastRef.current({
      title: "Business Status Updated",
      description: `${data.business.name} is now ${data.business.isActive ? 'active' : 'inactive'}.`,
    });
  }, [setBusinesses, setBusinessData, setStats]);

  const handleProfessionalCreated = useCallback((data: any) => {
    setProfessionals(prev => [data.professional, ...prev]);
    setProfessionalData((prev: any) => prev ? {
      ...prev,
      professionals: [data.professional, ...prev.professionals],
      pagination: {
        ...prev.pagination,
        totalItems: prev.pagination.totalItems + 1
      }
    } : null);
    setStats((prev: any) => ({
      ...prev,
      totalProfessionals: prev.totalProfessionals + 1,
    }));
    toastRef.current({
      title: "Professional Created",
      description: `${data.professional.name} has been added to the platform.`,
    });
  }, [setProfessionals, setProfessionalData, setStats]);

  const handleProfessionalUpdated = useCallback((data: any) => {
    setProfessionals(prev => prev.map((pro: any) =>
      pro.id === data.professional.id ? { ...pro, ...data.professional } : pro
    ));
    setProfessionalData((prev: any) => prev ? {
      ...prev,
      professionals: prev.professionals.map((pro: any) =>
        pro.id === data.professional.id ? { ...pro, ...data.professional } : pro
      )
    } : null);
    toastRef.current({
      title: "Professional Updated",
      description: `${data.professional.name} has been updated.`,
    });
  }, [setProfessionals, setProfessionalData]);

  const handleProfessionalDeleted = useCallback((data: any) => {
    setProfessionals(prev => prev.filter((pro: any) => pro.id !== data.professionalId));
    setProfessionalData((prev: any) => prev ? {
      ...prev,
      professionals: prev.professionals.filter((pro: any) => pro.id !== data.professionalId),
      pagination: {
        ...prev.pagination,
        totalItems: Math.max(0, prev.pagination.totalItems - 1)
      }
    } : null);
    setStats((prev: any) => ({
      ...prev,
      totalProfessionals: Math.max(0, prev.totalProfessionals - 1),
      activeProfessionals: data.isActive === true
        ? Math.max(0, prev.activeProfessionals - 1)
        : prev.activeProfessionals,
    }));
    toastRef.current({
      title: "Professional Deleted",
      description: "A professional has been removed from the platform.",
    });
  }, [setProfessionals, setProfessionalData, setStats]);

  const handleProfessionalStatusUpdated = useCallback((data: any) => {
    setProfessionals(prev => prev.map((pro: any) =>
      pro.id === data.professional.id ? { ...pro, ...data.professional } : pro
    ));
    setProfessionalData((prev: any) => prev ? {
      ...prev,
      professionals: prev.professionals.map((pro: any) =>
        pro.id === data.professional.id ? { ...pro, ...data.professional } : pro
      )
    } : null);
    setStats((prev: any) => ({
      ...prev,
      activeProfessionals: data.professional.isActive
        ? prev.activeProfessionals + 1
        : prev.activeProfessionals - 1,
    }));
    toastRef.current({
      title: "Professional Status Updated",
      description: `${data.professional.name} is now ${data.professional.isActive ? 'active' : 'inactive'}.`,
    });
  }, [setProfessionals, setProfessionalData, setStats]);

  const handleRegistrationInquiryUpdated = useCallback((data: any) => {
    setRegistrationInquiries(prev => prev.map((inquiry: any) =>
      inquiry.id === data.inquiry.id ? { ...inquiry, ...data.inquiry } : inquiry
    ));
    toastRef.current({
      title: "Registration Inquiry Updated",
      description: `Request from ${data.inquiry.name} has been updated.`,
    });
  }, [setRegistrationInquiries]);

  const handleRegistrationInquiryStatusUpdated = useCallback((data: any) => {
    setRegistrationInquiries(prev => prev.map((inquiry: any) =>
      inquiry.id === data.inquiry.id ? { ...inquiry, ...data.inquiry } : inquiry
    ));
    setStats((prev: any) => ({
      ...prev,
      totalInquiries: data.inquiry.status === 'PENDING'
        ? prev.totalInquiries + 1
        : Math.max(0, prev.totalInquiries - 1),
    }));
    toastRef.current({
      title: "Registration Request Status Updated",
      description: `${data.inquiry.name}'s request is now ${data.inquiry.status}.`,
    });
  }, [setRegistrationInquiries, setStats]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Register event listeners
    socket.on('business-created', handleBusinessCreated);
    socket.on('business-updated', handleBusinessUpdated);
    socket.on('business-deleted', handleBusinessDeleted);
    socket.on('business-status-updated', handleBusinessStatusUpdated);
    socket.on('professional-created', handleProfessionalCreated);
    socket.on('professional-updated', handleProfessionalUpdated);
    socket.on('professional-deleted', handleProfessionalDeleted);
    socket.on('professional-status-updated', handleProfessionalStatusUpdated);
    socket.on('registration-inquiry-updated', handleRegistrationInquiryUpdated);
    socket.on('registration-inquiry-status-updated', handleRegistrationInquiryStatusUpdated);

    // Cleanup listeners on unmount
    return () => {
      socket.off('business-created', handleBusinessCreated);
      socket.off('business-updated', handleBusinessUpdated);
      socket.off('business-deleted', handleBusinessDeleted);
      socket.off('business-status-updated', handleBusinessStatusUpdated);
      socket.off('professional-created', handleProfessionalCreated);
      socket.off('professional-updated', handleProfessionalUpdated);
      socket.off('professional-deleted', handleProfessionalDeleted);
      socket.off('professional-status-updated', handleProfessionalStatusUpdated);
      socket.off('registration-inquiry-updated', handleRegistrationInquiryUpdated);
      socket.off('registration-inquiry-status-updated', handleRegistrationInquiryStatusUpdated);
    };
  }, [socket, isConnected, handleBusinessCreated, handleBusinessUpdated, handleBusinessDeleted, handleBusinessStatusUpdated, handleProfessionalCreated, handleProfessionalUpdated, handleProfessionalDeleted, handleProfessionalStatusUpdated, handleRegistrationInquiryUpdated, handleRegistrationInquiryStatusUpdated]);
}