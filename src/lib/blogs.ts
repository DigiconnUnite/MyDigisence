import { db } from "@/lib/db";
import { blogPosts as staticBlogPosts } from "@/lib/blog-data";

const prisma = db as any;

export interface BlogSection {
  heading: string;
  content: string[];
}

export interface ManagedBlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
  coverImage?: string | null;
  contentHtml?: string | null;
  sections: BlogSection[];
  isPublished?: boolean;
  publishedAt: string;
}

const formatPublishedDate = (date: Date | null | undefined) => {
  if (!date) {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const sanitizeSections = (value: unknown): BlogSection[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => {
      const section = item as { heading?: unknown; content?: unknown };
      return {
        heading:
          typeof section.heading === "string" && section.heading.trim() !== ""
            ? section.heading
            : "Overview",
        content: Array.isArray(section.content)
          ? section.content.filter((line): line is string => typeof line === "string" && line.trim() !== "")
          : [],
      };
    })
    .filter((section) => section.content.length > 0);
};

const mapDbPost = (post: {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
  coverImage: string | null;
  contentHtml: string | null;
  sections: unknown;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
}): ManagedBlogPost => {
  const publishedDate = post.publishedAt ?? post.createdAt;

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    author: post.author,
    readTime: post.readTime,
    coverImage: post.coverImage,
    contentHtml: post.contentHtml,
    sections: sanitizeSections(post.sections),
    isPublished: post.isPublished,
    publishedAt: formatPublishedDate(publishedDate),
  };
};

export const getPublishedBlogPosts = async (): Promise<ManagedBlogPost[]> => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });

    if (posts.length > 0) {
      return posts.map(mapDbPost);
    }
  } catch (error) {
    console.error("Failed to load managed blog posts:", error);
  }

  return staticBlogPosts;
};

export const getPublishedBlogPostBySlug = async (slug: string): Promise<ManagedBlogPost | null> => {
  try {
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        isPublished: true,
      },
    });

    if (post) {
      return mapDbPost(post);
    }
  } catch (error) {
    console.error("Failed to load managed blog post:", error);
  }

  const fallback = staticBlogPosts.find((post) => post.slug === slug);
  return fallback ?? null;
};

export const getRelatedPublishedBlogPosts = async (
  slug: string,
  category: string,
  limit = 3,
): Promise<ManagedBlogPost[]> => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        isPublished: true,
        slug: { not: slug },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 20,
    });

    if (posts.length > 0) {
      const mapped: ManagedBlogPost[] = posts.map(mapDbPost);
      const sameCategory = mapped.filter((post: ManagedBlogPost) => post.category === category);
      const fallback = mapped.filter((post: ManagedBlogPost) => post.category !== category);
      return [...sameCategory, ...fallback].slice(0, limit);
    }
  } catch (error) {
    console.error("Failed to load related managed blog posts:", error);
  }

  const fallback = staticBlogPosts.filter((post: ManagedBlogPost) => post.slug !== slug);
  const sameCategory = fallback.filter((post: ManagedBlogPost) => post.category === category);
  const others = fallback.filter((post: ManagedBlogPost) => post.category !== category);
  return [...sameCategory, ...others].slice(0, limit);
};
