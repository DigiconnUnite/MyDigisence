import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  Eye,
  EyeOff,
  FileText,
  FolderTree,
  Globe,
  Image,
  Key,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";

interface BaseFormProps {
  generatedUsername: string;
  setGeneratedUsername: React.Dispatch<React.SetStateAction<string>>;
  generatedPassword: string;
  setGeneratedPassword: React.Dispatch<React.SetStateAction<string>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  generatePassword: () => string;
}

interface AddBusinessFormProps extends BaseFormProps {
  categories: any[];
  handleAddBusiness: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function AddBusinessForm({
  categories,
  handleAddBusiness,
  generatedUsername,
  setGeneratedUsername,
  generatedPassword,
  setGeneratedPassword,
  showPassword,
  setShowPassword,
  generatePassword,
}: AddBusinessFormProps) {
  return (
    <form
      id="add-business-form"
      onSubmit={handleAddBusiness}
      onKeyDown={(e) => {
        if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") e.preventDefault();
      }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label>Business Name</Label>
        <div className="relative">
          <Input name="name" required className="pl-10 rounded-md" placeholder="e.g. Acme Corp" />
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <div className="relative">
          <Textarea name="description" className="pl-10 rounded-md" placeholder="Brief business description..." />
          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <div className="relative">
          <Select name="categoryId" required>
            <SelectTrigger className="pl-10 rounded-md">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FolderTree className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Phone</Label>
          <div className="relative">
            <Input name="phone" className="pl-10 rounded-md" placeholder="+91 8080808080" />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Website</Label>
          <div className="relative">
            <Input name="website" className="pl-10 rounded-md" placeholder="https://example.com" />
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <Separator />
      <div>
        <h4 className="font-medium text-sm mb-4">Admin Account Details</h4>
        <div className="space-y-4 ">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Admin Name</Label>
              <div className="relative">
                <Input name="adminName" required className="pl-10 rounded-md" placeholder="Full Name" />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Admin Email</Label>
              <div className="relative">
                <Input name="email" type="email" required className="pl-10 rounded-md" placeholder="admin@example.com" />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Username</Label>
              <div className="relative">
                <Input
                  name="username"
                  value={generatedUsername}
                  onChange={(e) => setGeneratedUsername(e.target.value)}
                  className="pl-10 pr-20 rounded-md"
                  placeholder="Auto-generated"
                />
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 rounded-none hover:bg-transparent border-l"
                  onClick={(e) => {
                    e.preventDefault();
                    const form = document.getElementById("add-business-form") as HTMLFormElement;
                    const businessName = (form?.querySelector('input[name="name"]') as HTMLInputElement)?.value || "";
                    const adminName = (form?.querySelector('input[name="adminName"]') as HTMLInputElement)?.value || "";
                    const baseUsername =
                      adminName.toLowerCase().replace(/[^a-z0-9]/g, "") ||
                      businessName.toLowerCase().replace(/[^a-z0-9]/g, "");
                    setGeneratedUsername(`${baseUsername}_${Date.now().toString().slice(-4)}`);
                  }}
                >
                  <Key className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={generatedPassword}
                  onChange={(e) => setGeneratedPassword(e.target.value)}
                  className="pl-10 pr-20 rounded-md"
                  placeholder="Generated or manual password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <div className="absolute  right-1 top-1/2 -translate-y-1/2 flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 hover:bg-transparent border-l rounded-none"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 hover:bg-transparent border-l rounded-none"
                    onClick={(e) => {
                      e.preventDefault();
                      setGeneratedPassword(generatePassword());
                    }}
                  >
                    <Key className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

interface EditBusinessFormProps {
  editingBusiness: any;
  categories: any[];
  handleUpdateBusiness: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function EditBusinessForm({ editingBusiness, categories, handleUpdateBusiness }: EditBusinessFormProps) {
  return (
    <form id="edit-business-form" onSubmit={handleUpdateBusiness} className="space-y-4">
      <div className="space-y-2">
        <Label>Business Name</Label>
        <div className="relative">
          <Input name="name" defaultValue={editingBusiness.name} required className="pl-10 rounded-md" placeholder="Business name" />
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <div className="relative">
          <Textarea name="description" defaultValue={editingBusiness.description} className="pl-10 rounded-md" placeholder="Business description" />
          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Logo URL</Label>
        <div className="relative">
          <Input name="logo" defaultValue={editingBusiness.logo} className="pl-10 rounded-md" placeholder="https://example.com/logo.png" />
          <Image className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Address</Label>
          <div className="relative">
            <Input name="address" defaultValue={editingBusiness.address} className="pl-10 rounded-md" placeholder="Business address" />
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <div className="relative">
            <Input name="phone" defaultValue={editingBusiness.phone} className="pl-10 rounded-md" placeholder="+91 8080808080" />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Website</Label>
          <div className="relative">
            <Input name="website" defaultValue={editingBusiness.website} className="pl-10 rounded-md" placeholder="https://example.com" />
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Admin Email</Label>
          <div className="relative">
            <Input name="email" defaultValue={editingBusiness.admin.email} type="email" className="pl-10 rounded-md" placeholder="admin@example.com" />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <div className="relative">
          <Select name="categoryId" defaultValue={editingBusiness.category?.id || ""}>
            <SelectTrigger className="pl-10 rounded-md">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FolderTree className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </form>
  );
}

interface AddProfessionalFormProps extends BaseFormProps {
  handleAddProfessional: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function AddProfessionalForm({
  handleAddProfessional,
  generatedUsername,
  setGeneratedUsername,
  generatedPassword,
  setGeneratedPassword,
  showPassword,
  setShowPassword,
  generatePassword,
}: AddProfessionalFormProps) {
  return (
    <form id="add-professional-form" onSubmit={handleAddProfessional} className="space-y-4">
      <div className="space-y-2">
        <Label>Professional Name</Label>
        <div className="relative">
          <Input name="name" required className="pl-10 rounded-md" placeholder="Full Name" />
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <div className="relative">
          <Input name="phone" placeholder="+91 8080808080" className="pl-10 rounded-md" />
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <Separator />
      <div className="space-y-4">
        <h4 className="font-medium text-sm">Login Credentials</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Admin Name</Label>
            <div className="relative">
              <Input name="adminName" required className="pl-10 rounded-md" placeholder="Admin name" />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Admin Email</Label>
            <div className="relative">
              <Input name="email" type="email" required className="pl-10 rounded-md" placeholder="admin@example.com" />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Username</Label>
            <div className="relative">
              <Input
                name="username"
                value={generatedUsername}
                onChange={(e) => setGeneratedUsername(e.target.value)}
                className="pl-10 pr-20 rounded-md"
                placeholder="Auto-generated"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 border-l rounded-none bg-none"
                onClick={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget.closest("form") as HTMLFormElement;
                  const professionalName = (form?.querySelector('input[name="name"]') as HTMLInputElement)?.value || "";
                  const adminName = (form?.querySelector('input[name="adminName"]') as HTMLInputElement)?.value || "";
                  const baseUsername =
                    adminName.toLowerCase().replace(/[^a-z0-9]/g, "") ||
                    professionalName.toLowerCase().replace(/[^a-z0-9]/g, "");
                  setGeneratedUsername(`${baseUsername}_${Date.now().toString().slice(-4)}`);
                }}
              >
                <Key className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={generatedPassword}
                onChange={(e) => setGeneratedPassword(e.target.value)}
                className="pl-10 pr-20 rounded-md"
                placeholder="Generated or manual password"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 hover:bg-transparent border-l rounded-none"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 hover:bg-transparent border-l rounded-none"
                  onClick={(e) => {
                    e.preventDefault();
                    setGeneratedPassword(generatePassword());
                  }}
                  aria-label="Generate password"
                >
                  <Key className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

interface EditProfessionalFormProps {
  editingProfessional: any;
  handleUpdateProfessional: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function EditProfessionalForm({ editingProfessional, handleUpdateProfessional }: EditProfessionalFormProps) {
  return (
    <form id="edit-professional-form" onSubmit={handleUpdateProfessional} className="space-y-4">
      <div className="space-y-2">
        <Label>Professional Name</Label>
        <div className="relative">
          <Input name="name" defaultValue={editingProfessional.name} required className="pl-10 rounded-md" placeholder="Full Name" />
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Phone</Label>
        <div className="relative">
          <Input name="phone" defaultValue={editingProfessional.phone || ""} className="pl-10 rounded-md" placeholder="+91 8080808080" />
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <div className="relative">
          <Input name="email" defaultValue={editingProfessional.email || ""} type="email" className="pl-10 rounded-md" placeholder="email@example.com" />
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
    </form>
  );
}

interface AddCategoryFormProps {
  categories: any[];
  handleAddCategory: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function AddCategoryForm({ categories, handleAddCategory }: AddCategoryFormProps) {
  return (
    <form id="add-category-form" onSubmit={handleAddCategory} className="space-y-4">
      <div className="space-y-2">
        <Label>Category Name</Label>
        <div className="relative">
          <Input name="name" required className="pl-10 rounded-md" placeholder="Category name" />
          <FolderTree className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <div className="relative">
          <Textarea name="description" className="pl-10 rounded-md" placeholder="Category description..." />
          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Parent Category</Label>
        <div className="relative">
          <Select name="parentId">
            <SelectTrigger className="pl-10 rounded-md">
              <SelectValue placeholder="Select parent category (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No parent</SelectItem>
              {categories
                .filter((c) => !c.parentId)
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </form>
  );
}

interface EditCategoryFormProps {
  editingCategory: any;
  categories: any[];
  handleUpdateCategory: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function EditCategoryForm({ editingCategory, categories, handleUpdateCategory }: EditCategoryFormProps) {
  return (
    <form id="edit-category-form" onSubmit={handleUpdateCategory} className="space-y-4">
      <div className="space-y-2">
        <Label>Category Name</Label>
        <div className="relative">
          <Input name="name" defaultValue={editingCategory.name} required className="pl-10 rounded-md" placeholder="Category name" />
          <FolderTree className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <div className="relative">
          <Textarea name="description" defaultValue={editingCategory.description} className="pl-10 rounded-md" placeholder="Category description..." />
          <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Parent Category</Label>
        <div className="relative">
          <Select name="parentId" defaultValue={editingCategory.parentId || "none"}>
            <SelectTrigger className="pl-10 rounded-md">
              <SelectValue placeholder="Select parent category (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No parent</SelectItem>
              {categories
                .filter((c) => !c.parentId && c.id !== editingCategory.id)
                .map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </form>
  );
}

interface InquiryAccountFormProps extends BaseFormProps {
  inquiry: any;
  isBusiness: boolean;
  categories: any[];
  setCreatingAccount: React.Dispatch<React.SetStateAction<string | null>>;
  setRegistrationInquiries: React.Dispatch<React.SetStateAction<any[]>>;
  fetchData: () => Promise<void>;
  closePanel: () => void;
  toast: (args: { title: string; description: string; variant?: "destructive" }) => void;
  requestAdminMutation: <T>(
    input: RequestInfo | URL,
    init: RequestInit,
    defaultError?: string
  ) => Promise<{ ok: true; data: T | null } | { ok: false; error: string }>;
}

export function InquiryAccountForm({
  inquiry,
  isBusiness,
  categories,
  setCreatingAccount,
  setRegistrationInquiries,
  fetchData,
  closePanel,
  toast,
  requestAdminMutation,
  generatedUsername,
  setGeneratedUsername,
  generatedPassword,
  setGeneratedPassword,
  showPassword,
  setShowPassword,
  generatePassword,
}: InquiryAccountFormProps) {
  return (
    <form
      id="inquiry-account-form"
      onSubmit={async (e) => {
        e.preventDefault();
        setCreatingAccount(inquiry.id);
        try {
          const result = await requestAdminMutation(
            `/api/admin/registration-inquiries/${inquiry.id}/approve`,
            {
              method: "POST",
            },
            "Failed to create account."
          );

          if (result.ok) {
            setRegistrationInquiries((prev) =>
              prev.map((regInquiry) => (regInquiry.id === inquiry.id ? { ...regInquiry, status: "COMPLETED" } : regInquiry))
            );
            toast({ title: "Success", description: `Account created! Credentials sent to ${inquiry.email}` });
            await fetchData();
            closePanel();
          } else {
            toast({ title: "Error", description: result.error || "Failed to create account.", variant: "destructive" });
          }
        } catch (error) {
          console.error(error);
          toast({ title: "Error", description: "Failed to create account.", variant: "destructive" });
        } finally {
          setCreatingAccount(null);
        }
      }}
      className="space-y-4"
    >
      <div className="bg-gray-50 p-4 rounded-md border">
        <h4 className="font-medium text-sm mb-2">Inquiry Details</h4>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>
            Type: <span className="font-medium text-gray-900">{isBusiness ? "Business" : "Professional"}</span>
          </div>
          <div>
            Name: <span className="font-medium text-gray-900">{inquiry.name}</span>
          </div>
          <div>
            Email: <span className="font-medium text-gray-900">{inquiry.email}</span>
          </div>
          <div>
            Location: <span className="font-medium text-gray-900">{inquiry.location || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-sm">Account Configuration</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Admin Name</Label>
            <div className="relative">
              <Input name="adminName" defaultValue={inquiry.name} required className="pl-10 rounded-md" placeholder="Admin name" />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          {isBusiness && (
            <>
              <div className="space-y-2 md:col-span-2">
                <Label>Business Name</Label>
                <div className="relative">
                  <Input name="businessName" defaultValue={inquiry.businessName || inquiry.name} required className="pl-10 rounded-md" placeholder="Business name" />
                  <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <div className="relative">
                  <Textarea name="description" placeholder="Brief description..." className="pl-10 rounded-md" />
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Category</Label>
                <div className="relative">
                  <Select name="categoryId">
                    <SelectTrigger className="pl-10 rounded-md">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FolderTree className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium text-sm">Login Credentials</h4>
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            const form = e.currentTarget.closest("form") as HTMLFormElement;
            const adminNameInput = form?.querySelector('input[name="adminName"]') as HTMLInputElement;
            const name = adminNameInput?.value || "";
            const baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, "");
            setGeneratedUsername(`${baseUsername}_${Date.now().toString().slice(-4)}`);
          }}
          className="w-full rounded-md"
        >
          <User className="h-4 w-4 mr-2" /> Generate Username
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Username</Label>
            <div className="relative">
              <Input
                name="username"
                value={generatedUsername}
                onChange={(e) => setGeneratedUsername(e.target.value)}
                className="pl-10 pr-20 rounded-md"
                placeholder="Auto-generated"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget.closest("form") as HTMLFormElement;
                  const adminNameInput = form?.querySelector('input[name="adminName"]') as HTMLInputElement;
                  const name = adminNameInput?.value || "";
                  const baseUsername = name.toLowerCase().replace(/[^a-z0-9]/g, "");
                  setGeneratedUsername(`${baseUsername}_${Date.now().toString().slice(-4)}`);
                }}
              >
                <Key className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={generatedPassword}
                onChange={(e) => setGeneratedPassword(e.target.value)}
                className="pl-10 pr-20 rounded-md"
                placeholder="Generated or manual password"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-8 px-2 rounded-md"
                  onClick={(e) => {
                    e.preventDefault();
                    setGeneratedPassword(generatePassword());
                  }}
                  aria-label="Generate password"
                >
                  <Key className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
