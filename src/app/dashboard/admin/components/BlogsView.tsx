import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckSquare,
  Loader2,
  Plus,
  RefreshCw,
  Square,
  Trash2,
  Upload,
} from "lucide-react";
import AdminSectionHeader from "./AdminSectionHeader";
import AdminViewControls from "./AdminViewControls";

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
  coverImage?: string | null;
  contentHtml?: string | null;
  isPublished: boolean;
  createdAt: string;
}

interface BlogFormData {
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
  coverImage: string;
  contentHtml: string;
  isPublished: boolean;
}

const initialFormData: BlogFormData = {
  title: "",
  excerpt: "",
  category: "",
  author: "DigiSence Team",
  readTime: "5 min read",
  coverImage: "",
  contentHtml: "<p>Start writing your article here.</p>",
  isPublished: false,
};

const buildHtmlFromSections = (sections?: Array<{ heading: string; content: string[] }>) => {
  if (!sections || sections.length === 0) {
    return "<p>Start writing your article here.</p>";
  }

  return sections
    .map((section) => {
      const paragraphs = section.content
        .map((line) => `<p>${line}</p>`)
        .join("");
      return `<h2>${section.heading}</h2>${paragraphs}`;
    })
    .join("");
};

export default function BlogsView() {
  const [blogs, setBlogs] = useState<BlogPostItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState<"publish" | "unpublish" | "delete" | null>(null);
  const [formData, setFormData] = useState<BlogFormData>(initialFormData);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null);
  const [selectedBlogIds, setSelectedBlogIds] = useState<Set<string>>(new Set());
  const editorRef = useRef<HTMLDivElement>(null);

  const isEditing = editingBlogId !== null;

  const syncEditorContent = () => {
    const editorHtml = editorRef.current?.innerHTML ?? "";
    setFormData((prev) => ({ ...prev, contentHtml: editorHtml }));
  };

  const applyEditorCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    syncEditorContent();
  };

  const uploadMediaFile = async (file: File) => {
    const formDataPayload = new FormData();
    formDataPayload.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formDataPayload,
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || "Failed to upload media");
    }

    return payload.url as string;
  };

  const insertHtmlAtCursor = (html: string) => {
    editorRef.current?.focus();
    document.execCommand("insertHTML", false, html);
    syncEditorContent();
  };

  const uploadInlineImage = async (file: File) => {
    setIsUploadingImage(true);
    try {
      const url = await uploadMediaFile(file);
      insertHtmlAtCursor(
        `<figure><img src="${url}" alt="Inserted image" style="max-width:100%;border-radius:12px;" /><figcaption>Image</figcaption></figure>`,
      );
    } catch (error) {
      console.error("Inline image upload error:", error);
      alert("Failed to upload inline image.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setEditingBlogId(null);
    setShowCreateForm(false);
    setIsUploadingImage(false);
  };

  const openCreateForm = () => {
    setEditingBlogId(null);
    setFormData(initialFormData);
    setShowCreateForm(true);
  };

  const openEditForm = (blog: BlogPostItem) => {
    setEditingBlogId(blog.id);
    setFormData({
      title: blog.title,
      excerpt: blog.excerpt,
      category: blog.category,
      author: blog.author,
      readTime: blog.readTime,
      coverImage: blog.coverImage || "",
      contentHtml:
        blog.contentHtml ||
        buildHtmlFromSections((blog as BlogPostItem & { sections?: Array<{ heading: string; content: string[] }> }).sections),
      isPublished: blog.isPublished,
    });
    setShowCreateForm(true);
  };

  useEffect(() => {
    if (showCreateForm && editorRef.current) {
      editorRef.current.innerHTML = formData.contentHtml;
    }
  }, [showCreateForm, editingBlogId]);

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);

    try {
      const query = new URLSearchParams();
      if (searchTerm.trim()) {
        query.set("search", searchTerm.trim());
      }
      if (statusFilter !== "all") {
        query.set("status", statusFilter);
      }

      const response = await fetch(`/api/admin/blogs?${query.toString()}`);
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to fetch blogs");
      }

      setBlogs(Array.isArray(payload.blogs) ? payload.blogs : []);
      setSelectedBlogIds((prev) => {
        const next = new Set<string>();
        for (const blog of Array.isArray(payload.blogs) ? payload.blogs : []) {
          if (prev.has(blog.id)) {
            next.add(blog.id);
          }
        }
        return next;
      });
    } catch (error) {
      console.error("Blog fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const filteredBlogs = useMemo(() => {
    if (!searchTerm.trim()) {
      return blogs;
    }

    const term = searchTerm.toLowerCase();
    return blogs.filter((blog) => {
      return (
        blog.title.toLowerCase().includes(term) ||
        blog.category.toLowerCase().includes(term) ||
        blog.author.toLowerCase().includes(term)
      );
    });
  }, [blogs, searchTerm]);

  const toggleBlogSelection = (blogId: string) => {
    setSelectedBlogIds((prev) => {
      const next = new Set(prev);
      if (next.has(blogId)) {
        next.delete(blogId);
      } else {
        next.add(blogId);
      }
      return next;
    });
  };

  const selectVisibleBlogs = () => {
    const visibleIds = filteredBlogs.map((blog) => blog.id);
    setSelectedBlogIds((prev) => {
      const next = new Set(prev);
      const allVisibleSelected = visibleIds.length > 0 && visibleIds.every((id) => next.has(id));

      if (allVisibleSelected) {
        visibleIds.forEach((id) => next.delete(id));
      } else {
        visibleIds.forEach((id) => next.add(id));
      }

      return next;
    });
  };

  const clearSelection = () => {
    setSelectedBlogIds(new Set());
  };

  const uploadCoverImage = async (file: File) => {
    setIsUploadingImage(true);

    try {
      const formDataPayload = new FormData();
      formDataPayload.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formDataPayload,
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to upload image");
      }

      setFormData((prev) => ({ ...prev, coverImage: payload.url || "" }));
    } catch (error) {
      console.error("Blog cover upload error:", error);
      alert("Failed to upload cover image.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmitBlog = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsSubmitting(true);
    try {
      const contentHtml = editorRef.current?.innerHTML || formData.contentHtml;

      if (!contentHtml.trim()) {
        alert("Write the blog content before saving.");
        return;
      }

      const response = await fetch(
        editingBlogId ? `/api/admin/blogs/${editingBlogId}` : "/api/admin/blogs",
        {
          method: editingBlogId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: formData.title,
            excerpt: formData.excerpt,
            category: formData.category,
            author: formData.author,
            readTime: formData.readTime,
            coverImage: formData.coverImage || null,
            isPublished: formData.isPublished,
            contentHtml,
          }),
        }
      );

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Failed to create blog");
      }

      resetForm();
      await fetchBlogs();
    } catch (error) {
      console.error(isEditing ? "Edit blog error:" : "Create blog error:", error);
      alert(
        isEditing
          ? "Failed to update blog post. Please check fields and try again."
          : "Failed to create blog post. Please check fields and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkPublish = async (isPublished: boolean) => {
    if (selectedBlogIds.size === 0) return;

    setBulkActionLoading(isPublished ? "publish" : "unpublish");
    try {
      await Promise.all(
        Array.from(selectedBlogIds).map((id) =>
          fetch(`/api/admin/blogs/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ isPublished }),
          }),
        ),
      );

      await fetchBlogs();
      clearSelection();
    } catch (error) {
      console.error("Bulk publish error:", error);
      alert("Failed to update selected blog posts.");
    } finally {
      setBulkActionLoading(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedBlogIds.size === 0) return;

    const shouldDelete = window.confirm(`Delete ${selectedBlogIds.size} selected blog post(s)?`);
    if (!shouldDelete) return;

    setBulkActionLoading("delete");
    try {
      await Promise.all(
        Array.from(selectedBlogIds).map((id) =>
          fetch(`/api/admin/blogs/${id}`, {
            method: "DELETE",
          }),
        ),
      );

      await fetchBlogs();
      clearSelection();
    } catch (error) {
      console.error("Bulk delete error:", error);
      alert("Failed to delete selected blog posts.");
    } finally {
      setBulkActionLoading(null);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    const shouldDelete = window.confirm("Delete this blog post?");
    if (!shouldDelete) return;

    try {
      const response = await fetch(`/api/admin/blogs/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete blog");
      }
      setSelectedBlogIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      await fetchBlogs();
    } catch (error) {
      console.error("Delete blog error:", error);
      alert("Failed to delete blog post.");
    }
  };

  const handleTogglePublish = async (blog: BlogPostItem) => {
    try {
      const response = await fetch(`/api/admin/blogs/${blog.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          isPublished: !blog.isPublished,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update publish status");
      }

      await fetchBlogs();
    } catch (error) {
      console.error("Publish toggle error:", error);
      alert("Failed to update publish status.");
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <AdminSectionHeader
        title="Manage Blogs"
        description="Create, publish, and manage all website blogs from Super Admin"
      />

      <AdminViewControls
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search blogs by title, category, or author..."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={fetchBlogs}
              className="rounded-xl"
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              onClick={openCreateForm}
              className="rounded-xl bg-linear-90 from-[#5757FF] to-[#A89CFE] text-white hover:opacity-90 transition-opacity"
            >
              <Plus className="h-4 w-4 mr-2" />
              {showCreateForm && !isEditing ? "Close" : "New Blog"}
            </Button>
          </div>
        }
      />

      {selectedBlogIds.size > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3">
          <div className="text-sm font-medium text-gray-700">
            {selectedBlogIds.size} selected
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => handleBulkPublish(true)}
              disabled={bulkActionLoading !== null}
              className="rounded-xl"
            >
              {bulkActionLoading === "publish" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Publish
            </Button>
            <Button
              variant="outline"
              onClick={() => handleBulkPublish(false)}
              disabled={bulkActionLoading !== null}
              className="rounded-xl"
            >
              {bulkActionLoading === "unpublish" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Unpublish
            </Button>
            <Button
              variant="outline"
              onClick={handleBulkDelete}
              disabled={bulkActionLoading !== null}
              className="rounded-xl border-red-200 text-red-600 hover:bg-red-50"
            >
              {bulkActionLoading === "delete" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Delete
            </Button>
            <Button variant="ghost" onClick={clearSelection} className="rounded-xl">
              Clear
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          variant={statusFilter === "all" ? "default" : "outline"}
          onClick={() => setStatusFilter("all")}
          className="rounded-full"
        >
          All
        </Button>
        <Button
          variant={statusFilter === "published" ? "default" : "outline"}
          onClick={() => setStatusFilter("published")}
          className="rounded-full"
        >
          Published
        </Button>
        <Button
          variant={statusFilter === "draft" ? "default" : "outline"}
          onClick={() => setStatusFilter("draft")}
          className="rounded-full"
        >
          Draft
        </Button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleSubmitBlog} className="rounded-2xl border bg-white p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 border-b pb-3">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {isEditing ? "Edit Blog" : "Create Blog"}
              </h3>
              <p className="text-xs text-gray-500">
                {isEditing ? "Update the selected post and save changes." : "Draft a new post for the public blog."}
              </p>
            </div>
            {isEditing && (
              <Badge variant="secondary" className="rounded-full">
                Editing
              </Badge>
            )}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Input
              placeholder="Blog title"
              value={formData.title}
              onChange={(event) => setFormData((prev) => ({ ...prev, title: event.target.value }))}
              required
            />
            <Input
              placeholder="Category"
              value={formData.category}
              onChange={(event) => setFormData((prev) => ({ ...prev, category: event.target.value }))}
              required
            />
            <Input
              placeholder="Author"
              value={formData.author}
              onChange={(event) => setFormData((prev) => ({ ...prev, author: event.target.value }))}
              required
            />
            <Input
              placeholder="Read time (e.g. 6 min read)"
              value={formData.readTime}
              onChange={(event) => setFormData((prev) => ({ ...prev, readTime: event.target.value }))}
              required
            />
            <Input
              placeholder="Cover image URL (optional)"
              value={formData.coverImage}
              onChange={(event) => setFormData((prev) => ({ ...prev, coverImage: event.target.value }))}
            />
            <label className="flex items-center gap-2 text-sm text-gray-700 px-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="blog-cover-upload"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    void uploadCoverImage(file);
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-xl"
                onClick={() => document.getElementById("blog-cover-upload")?.click()}
                disabled={isUploadingImage}
              >
                {isUploadingImage ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Upload Image
              </Button>
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 px-2 md:col-span-2">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(event) => setFormData((prev) => ({ ...prev, isPublished: event.target.checked }))}
              />
              Publish immediately
            </label>
          </div>
          {formData.coverImage && (
            <div className="rounded-xl border bg-gray-50 p-3 text-xs text-gray-600">
              Uploaded image URL: {formData.coverImage}
            </div>
          )}
          <Textarea
            placeholder="Short excerpt"
            value={formData.excerpt}
            onChange={(event) => setFormData((prev) => ({ ...prev, excerpt: event.target.value }))}
            required
          />
          <div className="space-y-3 rounded-2xl border bg-slate-50 p-4">
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" variant="outline" className="rounded-lg" onClick={() => applyEditorCommand("bold")}>
                <strong>B</strong>
              </Button>
              <Button type="button" variant="outline" className="rounded-lg" onClick={() => applyEditorCommand("italic")}>
                <em>I</em>
              </Button>
              <Button type="button" variant="outline" className="rounded-lg" onClick={() => applyEditorCommand("underline")}>
                <span className="underline">U</span>
              </Button>
              <Button type="button" variant="outline" className="rounded-lg" onClick={() => applyEditorCommand("formatBlock", "h2")}>
                H2
              </Button>
              <Button type="button" variant="outline" className="rounded-lg" onClick={() => applyEditorCommand("formatBlock", "blockquote")}>
                Quote
              </Button>
              <Button type="button" variant="outline" className="rounded-lg" onClick={() => applyEditorCommand("insertUnorderedList")}>
                Bullets
              </Button>
              <Button type="button" variant="outline" className="rounded-lg" onClick={() => applyEditorCommand("insertOrderedList")}>
                Numbered
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-lg"
                onClick={() => {
                  const url = window.prompt("Enter a link URL");
                  if (url) {
                    applyEditorCommand("createLink", url);
                  }
                }}
              >
                Link
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-lg"
                onClick={() => applyEditorCommand("removeFormat")}
              >
                Clear
              </Button>
              <label className="inline-flex cursor-pointer items-center rounded-lg border border-dashed border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                <Upload className="mr-2 h-4 w-4" />
                Insert Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) {
                      void uploadInlineImage(file);
                    }
                    event.currentTarget.value = "";
                  }}
                />
              </label>
            </div>

            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={syncEditorContent}
              className="min-h-[320px] rounded-2xl border bg-white p-4 text-sm leading-7 text-gray-900 shadow-sm outline-none"
              style={{ whiteSpace: "normal" }}
            />
            <p className="text-xs text-gray-500">
              Use the toolbar for formatting, links, lists, quotes, and inline image inserts.
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={resetForm} className="rounded-xl mr-2">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="rounded-xl">
              {isSubmitting ? (isEditing ? "Saving..." : "Creating...") : isEditing ? "Save Changes" : "Create Blog"}
            </Button>
          </div>
        </form>
      )}

      <div className="rounded-2xl border bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800 text-white">
              <tr>
                <th className="px-4 py-3 text-left font-medium">
                  <button type="button" onClick={selectVisibleBlogs} className="inline-flex items-center">
                    {filteredBlogs.length > 0 && filteredBlogs.every((blog) => selectedBlogIds.has(blog.id)) ? (
                      <CheckSquare className="h-4 w-4" />
                    ) : (
                      <Square className="h-4 w-4" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left font-medium">Title</th>
                <th className="px-4 py-3 text-left font-medium">Category</th>
                <th className="px-4 py-3 text-left font-medium">Author</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-gray-500">
                    {isLoading ? "Loading blogs..." : "No blogs found"}
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((blog) => (
                  <tr key={blog.id} className="border-t">
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleBlogSelection(blog.id)}
                        className="inline-flex items-center text-gray-600"
                      >
                        {selectedBlogIds.has(blog.id) ? (
                          <CheckSquare className="h-4 w-4 text-orange-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900">{blog.title}</p>
                      <p className="text-xs text-gray-500">/{blog.slug}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{blog.category}</td>
                    <td className="px-4 py-3 text-gray-700">{blog.author}</td>
                    <td className="px-4 py-3">
                      <Badge variant={blog.isPublished ? "default" : "secondary"}>
                        {blog.isPublished ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditForm(blog)}
                          className="rounded-md"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePublish(blog)}
                          className="rounded-md"
                        >
                          {blog.isPublished ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteBlog(blog.id)}
                          className="rounded-md border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
