"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, Send, Paperclip, MoreVertical, Phone, Video, 
  CheckCheck, ChevronLeft, Image as ImageIcon, Smile, MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  attachments?: { type: "image" | "file"; name: string; url?: string }[];
}

interface Conversation {
  id: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

interface MessagesViewProps {
  conversations?: Conversation[];
  isLoading?: boolean;
}

const defaultConversations: Conversation[] = [
  {
    id: "1",
    participantName: "Vikram Mahto",
    lastMessage: "Thanks for the quick response!",
    lastMessageTime: "2 min ago",
    unreadCount: 2,
    isOnline: true,
    messages: [
      { id: "1", senderId: "them", text: "Hi, I'm interested in your web development services", timestamp: "10:30 AM", status: "read" },
      { id: "2", senderId: "me", text: "Hello! I'd be happy to help. What kind of project are you looking for?", timestamp: "10:32 AM", status: "read" },
      { id: "3", senderId: "them", text: "I need an e-commerce website for my business", timestamp: "10:35 AM", status: "read" },
      { id: "4", senderId: "me", text: "Great! I have experience with e-commerce platforms. Can you share more details?", timestamp: "10:38 AM", status: "read" },
      { id: "5", senderId: "them", text: "Thanks for the quick response!", timestamp: "2 min ago", status: "sent" },
    ],
  },
  {
    id: "2",
    participantName: "Pooja Patel",
    lastMessage: "Can we schedule a call tomorrow?",
    lastMessageTime: "1 hour ago",
    unreadCount: 1,
    isOnline: false,
    messages: [
      { id: "1", senderId: "them", text: "Hi Shivam, loved your portfolio!", timestamp: "Yesterday", status: "read" },
      { id: "2", senderId: "me", text: "Thank you! What project do you have in mind?", timestamp: "Yesterday", status: "read" },
      { id: "3", senderId: "them", text: "Can we schedule a call tomorrow?", timestamp: "1 hour ago", status: "sent" },
    ],
  },
  {
    id: "3",
    participantName: "Amit Kumar",
    lastMessage: "The project looks great!",
    lastMessageTime: "2 hours ago",
    unreadCount: 0,
    isOnline: true,
    messages: [
      { id: "1", senderId: "me", text: "I've completed the initial designs. Please take a look.", timestamp: "Yesterday", status: "read" },
      { id: "2", senderId: "them", text: "The project looks great!", timestamp: "2 hours ago", status: "read" },
    ],
  },
];

export default function MessagesView({ conversations, isLoading = false }: MessagesViewProps) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(defaultConversations[0]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const data = conversations || defaultConversations;
  const filteredConversations = data.filter(c => 
    c.participantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;
    setMessageText("");
  };

  if (isLoading) {
    return (
      <div className="animate-pulse h-[600px] bg-gray-200 rounded-xl" />
    );
  }

  return (
    <div className="h-[calc(100vh-200px)] min-h-[600px]">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 h-full border rounded-xl overflow-hidden">
        {/* Conversations List */}
        <div className={cn(
          "border-r bg-white",
          selectedConversation ? "hidden lg:block" : "block"
        )}>
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="overflow-y-auto h-[calc(100%-100px)]">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={cn(
                  "w-full flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors text-left",
                  selectedConversation?.id === conv.id && "bg-blue-50 hover:bg-blue-50"
                )}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {conv.participantName.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  {conv.isOnline && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">{conv.participantName}</h3>
                    <span className="text-xs text-gray-500">{conv.lastMessageTime}</span>
                  </div>
                  <p className={cn(
                    "text-sm truncate",
                    conv.unreadCount > 0 ? "text-gray-900 font-medium" : "text-gray-500"
                  )}>
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unreadCount > 0 && (
                  <Badge className="bg-blue-600 text-white text-xs px-2 py-0.5">
                    {conv.unreadCount}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn(
          "lg:col-span-2 bg-gray-50 flex flex-col",
          !selectedConversation && "hidden lg:flex"
        )}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 bg-white border-b">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="lg:hidden"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                        {selectedConversation.participantName.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    {selectedConversation.isOnline && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConversation.participantName}</h3>
                    <p className="text-xs text-gray-500">
                      {selectedConversation.isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.senderId === "me" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[70%] px-4 py-2.5 rounded-2xl",
                        msg.senderId === "me" 
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-white text-gray-900 rounded-bl-md shadow-sm"
                      )}
                    >
                      <p>{msg.text}</p>
                      <div className={cn(
                        "flex items-center gap-1 mt-1 text-xs",
                        msg.senderId === "me" ? "text-blue-200" : "text-gray-400"
                      )}>
                        <span>{msg.timestamp}</span>
                        {msg.senderId === "me" && (
                          <CheckCheck className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ImageIcon className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button variant="ghost" size="icon">
                    <Smile className="h-5 w-5" />
                  </Button>
                  <Button 
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
