import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Send, X } from "lucide-react";
import { InquiryFormData, Product } from "@/components/business-profile/BusinessProfile.types";

interface BusinessInquiryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: Product | null;
  inquiryData: InquiryFormData;
  setInquiryData: React.Dispatch<React.SetStateAction<InquiryFormData>>;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
}

export default function BusinessInquiryModal({
  open,
  onOpenChange,
  selectedProduct,
  inquiryData,
  setInquiryData,
  isSubmitting,
  onSubmit,
}: BusinessInquiryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {selectedProduct ? `Inquire about ${selectedProduct.name}` : "Get in Touch"}
          </DialogTitle>
          <DialogDescription>
            Send us a message and we'll get back to you soon.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={inquiryData.name}
              onChange={(e) =>
                setInquiryData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={inquiryData.email}
              onChange={(e) =>
                setInquiryData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              type="tel"
              value={inquiryData.phone}
              onChange={(e) =>
                setInquiryData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={inquiryData.message}
              onChange={(e) =>
                setInquiryData((prev) => ({
                  ...prev,
                  message: e.target.value,
                }))
              }
              rows={4}
              required
            />
          </div>
          <div className="flex space-x-3">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                <>Sending...</>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Inquiry
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
