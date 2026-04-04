import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CalendarDays, Clock3, UserRound } from "lucide-react";
import UnifiedPublicLayout from "@/components/UnifiedPublicLayout";
import { blogPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog-data";

const coverImages = [
  "/footer-bg.jpg",
  "/card-bg.png",
  "/contact.png",
  "/b-1.png",
  "/p-1.png",
  "/d-1.png",
];

const getCoverImage = (postSlug: string) => {
  const postIndex = blogPosts.findIndex((item) => item.slug === postSlug);
  return coverImages[(postIndex >= 0 ? postIndex : 0) % coverImages.length];
};

interface BlogDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

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
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }
  const imageSrc = getCoverImage(post.slug);
  const relatedPosts = getRelatedPosts(post.slug, 3);

  return (
    <UnifiedPublicLayout variant="solid" sidebarVariant="home">
      <div className="bg-slate-100">
        <section className="container mx-auto px-4 py-10 md:px-6 md:py-14">
          <div className="mx-auto max-w-4xl">
            <Link
              href="/blog"
              className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Blog
            </Link>

            <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-slate-600 md:text-sm">
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

            <div className="mt-6 overflow-hidden rounded-lg border border-slate-300 bg-white p-2">
              <div className="relative h-56 w-full overflow-hidden rounded-md md:h-80">
                <Image
                  src={imageSrc}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 896px"
                  className="object-cover"
                />
              </div>
            </div>

            <article className="mt-8 rounded-lg border border-slate-300 bg-white p-5 md:p-7">
              {post.sections.map((section) => (
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
              ))}
            </article>

            <section className="mt-8">
              <h2 className="text-xl font-extrabold text-slate-900 md:text-2xl">Related Blogs</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog-details/${related.slug}`}
                    className="group block overflow-hidden rounded-lg border border-slate-300 bg-white transition hover:-translate-y-1"
                  >
                    <div className="p-2 pb-0">
                      <div className="relative h-40 w-full overflow-hidden rounded-md md:h-44">
                        <Image
                          src={getCoverImage(related.slug)}
                          alt={related.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="line-clamp-2 text-sm font-bold text-slate-900 md:text-base">
                        {related.title}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-slate-700 transition group-hover:text-cyan-700">
                        Read Blog
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>
        </section>
      </div>
    </UnifiedPublicLayout>
  );
}
