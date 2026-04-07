import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, CalendarDays, Clock3, UserRound } from "lucide-react";
import UnifiedPublicLayout from "@/components/UnifiedPublicLayout";
import {
  getPublishedBlogPostBySlug,
  getPublishedBlogPosts,
  getRelatedPublishedBlogPosts,
} from "@/lib/blogs";

const coverImages = [
  "/footer-bg.jpg",
  "/card-bg.png",
  "/contact.png",
  "/b-1.png",
  "/p-1.png",
  "/d-1.png",
];

interface BlogDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | DigiSence",
    };
  }

  return {
    title: `${post.title} | DigiSence Blog`,
    description: post.excerpt,
  };
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { slug } = await params;
  const post = await getPublishedBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }
  const allPosts = await getPublishedBlogPosts();
  const imageIndex = Math.max(0, allPosts.findIndex((item) => item.slug === post.slug));
  const imageSrc = post.coverImage || coverImages[imageIndex % coverImages.length];
  const relatedPosts = await getRelatedPublishedBlogPosts(post.slug, post.category, 3);

  return (
    <UnifiedPublicLayout variant="solid" sidebarVariant="home">
      <div className="">
        <section className="max-w-7xl mx-auto px-4 py-10 md:px-6 md:py-14">
          <div className=" mx-auto ">
            <div className="mb-4  flex flex-wrap items-center gap-3 text-xs text-slate-600 md:text-sm">
              <span className="rounded-full border border-slate-300 bg-white px-3 py-1 font-semibold text-slate-700">
                {post.category}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                {post.publishedAt}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4" />
                {post.readTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <UserRound className="h-4 w-4" />
                {post.author}
              </span>
            </div>

            <h1 className="text-3xl font-extrabold leading-tight text-slate-900 md:text-4xl">
              {post.title}
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-slate-600 md:text-base">
              {post.excerpt}
            </p>

            <div className="mt-6 overflow-hidden rounded-lg border ">
              <div className="relative h-96 w-full overflow-hidden rounded-md ">
                <Image
                  src={imageSrc}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="object-cover"
                />
              </div>
            </div>

            <article className="mt-8 rounded-lg border border-slate-200 bg-white p-5 md:p-7">
              {post.contentHtml ? (
                <div
                  className="blog-rich-content space-y-4 text-sm leading-relaxed text-slate-700 md:text-base"
                  dangerouslySetInnerHTML={{ __html: post.contentHtml }}
                />
              ) : (
                post.sections.map((section) => (
                  <div key={section.heading} className="mb-8 last:mb-0">
                    <h2 className="text-xl font-extrabold text-slate-900 md:text-2xl">
                      {section.heading}
                    </h2>
                    <div className="mt-3 space-y-4 text-sm leading-relaxed text-slate-700 md:text-base">
                      {section.content.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </article>
          </div>
          <section className="mt-8 border-t pt-8 border-t-slate-700/50">
            <h2 className="text-xl font-extrabold text-slate-900 md:text-2xl">
              Related Blogs
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related, index) => (
                <Link
                  key={related.slug}
                  href={`/blog-details/${related.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-slate-400/90 bg-white transition duration-300 hover:-translate-y-1"
                >
                  <article className="rounded-lg bg-white">
                    <div className="p-2 pb-0">
                      <div className="relative h-56 w-full overflow-hidden rounded-xl md:h-60">
                        <Image
                          src={related.coverImage || coverImages[index % coverImages.length]}
                          alt={related.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition duration-700 group-hover:scale-110"
                        />
                      </div>
                    </div>

                    <div className="p-4 md:p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                          {related.category}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                          <Clock3 className="h-3.5 w-3.5" />
                          {related.readTime}
                        </span>
                      </div>

                      <h2 className="mt-3 line-clamp-2 text-lg font-extrabold leading-tight text-slate-900 md:text-xl">
                        {related.title}
                      </h2>

                      <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800 transition group-hover:text-cyan-700">
                        Read Article
                        <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </section>
      </div>
    </UnifiedPublicLayout>
  );
}
