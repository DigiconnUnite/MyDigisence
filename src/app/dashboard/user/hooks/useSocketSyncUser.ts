import { useEffect, useCallback } from "react";
import type { Socket } from "socket.io-client";

interface UserSocketSyncOptions {
  setInquiries: React.Dispatch<React.SetStateAction<any[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
  setActivity: React.Dispatch<React.SetStateAction<any[]>>;
  setSavedItems: React.Dispatch<React.SetStateAction<any[]>>;
  toast: (args: { title: string; description: string; variant?: "destructive" }) => void;
  userId: string;
}

export function useSocketSyncUser(
  socket: Socket | null,
  isConnected: boolean,
  options: UserSocketSyncOptions
) {
  const { setInquiries, setNotifications, setActivity, setSavedItems, toast, userId } = options;

  const handleInquiryStatusChanged = useCallback((data: any) => {
    if (data.userId === userId) {
      setInquiries((prev) => prev.map((i) => (i.id === data.inquiry.id ? data.inquiry : i)));
      toast({
        title: "Inquiry Updated",
        description: `Your inquiry status changed to ${data.inquiry.status}`,
      });
    }
  }, [userId, setInquiries, toast]);

  const handleNotificationReceived = useCallback((data: any) => {
    if (data.userId === userId) {
      setNotifications((prev) => [data.notification, ...prev]);
      toast({ title: data.notification.title || "Notification", description: data.notification.message || "" });
    }
  }, [userId, setNotifications, toast]);

  const handleActivityAdded = useCallback((data: any) => {
    if (data.userId === userId) {
      setActivity((prev) => [data.activity, ...prev]);
    }
  }, [userId, setActivity]);

  const handleSavedItemRemoved = useCallback((data: any) => {
    if (data.userId === userId) {
      setSavedItems((prev) => prev.filter((item) => item.id !== data.savedItemId));
    }
  }, [userId, setSavedItems]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on("inquiry:status-changed", handleInquiryStatusChanged);
    socket.on("notification:received", handleNotificationReceived);
    socket.on("activity:added", handleActivityAdded);
    socket.on("saved-item:removed", handleSavedItemRemoved);

    return () => {
      socket.off("inquiry:status-changed", handleInquiryStatusChanged);
      socket.off("notification:received", handleNotificationReceived);
      socket.off("activity:added", handleActivityAdded);
      socket.off("saved-item:removed", handleSavedItemRemoved);
    };
  }, [
    socket,
    isConnected,
    handleInquiryStatusChanged,
    handleNotificationReceived,
    handleActivityAdded,
    handleSavedItemRemoved,
  ]);
}
