import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock3 } from "lucide-react";
import UnifiedPublicLayout from "@/components/UnifiedPublicLayout";
import { blogPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog | DigiSence",
  description:
    "Read practical insights on digital presence, growth, branding, and technology for businesses and professionals.",
};

const coverImages = [
  "/footer-bg.jpg",
  "/footer-bg.jpg",
  "/footer-bg.jpg",
  "/footer-bg.jpg",
  "/footer-bg.jpg",
];

export default function BlogPage() {
  return (
    <UnifiedPublicLayout variant="solid" sidebarVariant="home">
      <div className="relative overflow-hidden">
        <section className="container mx-auto px-4 py-16 md:px-6 md:py-24">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => (
              <Link
                key={post.slug}
                href={`/blog-details/${post.slug}`}
                className="group block overflow-hidden rounded-2xl border border-slate-400/90 bg-white transition duration-300 hover:-translate-y-1"
              >
                <article className="rounded-lg bg-white">
                  <div className="p-2 pb-0">
                    <div className="relative h-56 w-full overflow-hidden rounded-xl  md:h-60">
                      <Image
                        src={coverImages[index % coverImages.length]}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  <div className="p-4 md:p-5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                        {post.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500">
                        <Clock3 className="h-3.5 w-3.5" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="mt-3 line-clamp-2 text-lg font-extrabold leading-tight text-slate-900 md:text-xl">
                      {post.title}
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
      </div>
    </UnifiedPublicLayout>
  );
}
