import { useEffect, useCallback } from "react";
import type { Socket } from "socket.io-client";

interface ProfessionalSocketSyncOptions {
  setServices: React.Dispatch<React.SetStateAction<any[]>>;
  setEnquiries: React.Dispatch<React.SetStateAction<any[]>>;
  setAppointments: React.Dispatch<React.SetStateAction<any[]>>;
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  setStats: React.Dispatch<React.SetStateAction<any>>;
  toast: (args: { title: string; description: string; variant?: "destructive" }) => void;
  professionalId: string;
}

export function useSocketSyncProfessional(
  socket: Socket | null,
  isConnected: boolean,
  options: ProfessionalSocketSyncOptions
) {
  const { setServices, setEnquiries, setAppointments, setMessages, setStats, toast, professionalId } = options;

  const handleEnquiryCreated = useCallback((data: any) => {
    if (data.professionalId === professionalId) {
      setEnquiries((prev) => [data.enquiry, ...prev]);
      setStats((prev: any) => ({
        ...prev,
        totalEnquiries: (prev?.totalEnquiries || 0) + 1,
        newEnquiries: (prev?.newEnquiries || 0) + 1,
      }));
      toast({ title: "New Enquiry", description: "You have received a new enquiry." });
    }
  }, [professionalId, setEnquiries, setStats, toast]);

  const handleEnquiryUpdated = useCallback((data: any) => {
    if (data.professionalId === professionalId) {
      setEnquiries((prev) => prev.map((e) => (e.id === data.enquiry.id ? data.enquiry : e)));
    }
  }, [professionalId, setEnquiries]);

  const handleAppointmentCreated = useCallback((data: any) => {
    if (data.professionalId === professionalId) {
      setAppointments((prev) => [data.appointment, ...prev]);
      setStats((prev: any) => ({
        ...prev,
        totalAppointments: (prev?.totalAppointments || 0) + 1,
      }));
      toast({ title: "New Appointment", description: "A new appointment has been scheduled." });
    }
  }, [professionalId, setAppointments, setStats, toast]);

  const handleAppointmentUpdated = useCallback((data: any) => {
    if (data.professionalId === professionalId) {
      setAppointments((prev) => prev.map((a) => (a.id === data.appointment.id ? data.appointment : a)));
    }
  }, [professionalId, setAppointments]);

  const handleMessageReceived = useCallback((data: any) => {
    if (data.professionalId === professionalId) {
      setMessages((prev) => [data.message, ...prev]);
      toast({ title: "New Message", description: `New message from ${data.senderName || "a client"}` });
    }
  }, [professionalId, setMessages, toast]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("enquiry:created", handleEnquiryCreated);
    socket.on("enquiry:updated", handleEnquiryUpdated);
    socket.on("appointment:created", handleAppointmentCreated);
    socket.on("appointment:updated", handleAppointmentUpdated);
    socket.on("message:received", handleMessageReceived);

    return () => {
      socket.off("enquiry:created", handleEnquiryCreated);
      socket.off("enquiry:updated", handleEnquiryUpdated);
      socket.off("appointment:created", handleAppointmentCreated);
      socket.off("appointment:updated", handleAppointmentUpdated);
      socket.off("message:received", handleMessageReceived);
    };
  }, [
    socket,
    isConnected,
    handleEnquiryCreated,
    handleEnquiryUpdated,
    handleAppointmentCreated,
    handleAppointmentUpdated,
    handleMessageReceived,
  ]);
}
