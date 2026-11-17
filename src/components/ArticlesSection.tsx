"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Clock, X } from "lucide-react";
import type { ArticleItem } from "@/lib/types";

interface ArticlesSectionProps {
  articles: ArticleItem[];
}

export default function ArticlesSection({ articles }: ArticlesSectionProps) {
  const published = useMemo(
    () => articles.filter((a) => a.published),
    [articles]
  );
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);

  if (published.length === 0) return null;

  return (
    <section id="guides" className="py-20 sm:py-28 bg-[#F2EAE0]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-12">
          <span className="inline-block text-xs font-mono-meta uppercase tracking-[0.2em] text-[#A65C38] mb-3">
            Practice Guides & Notes
          </span>
          <h2 className="font-serif-display text-4xl sm:text-5xl text-[#14110F] leading-[1.08]">
            Read, practice, <em className="italic text-[#A65C38]">grow</em>
          </h2>
          <p className="text-base text-[#6E5A4F] mt-3">
            Practical insights for parents, adult beginners, and growing
            musicians.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {published.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => setActiveArticle(article)}
              className="group text-left rounded-2xl overflow-hidden bg-[#FAF6F0] border border-[#C87A53]/20 hover:border-[#C87A53] transition-all shadow-sm hover:shadow-xl cursor-pointer flex flex-col"
            >
              <div className="relative h-48 w-full overflow-hidden bg-[#14110F]">
                <img
                  src={
                    article.coverImage ||
                    "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&q=85"
                  }
                  alt={article.title}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-[#14110F]/80 backdrop-blur-sm text-[11px] font-mono-meta uppercase tracking-[0.12em] text-[#FAF6F0]">
                  {article.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono-meta text-[#A65C38] mb-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{article.readTime}</span>
                  </div>
                  <h3 className="font-serif-display text-2xl text-[#14110F] leading-snug mb-3 group-hover:text-[#A65C38] transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-sm text-[#6E5A4F] leading-relaxed mb-5">
                    {article.excerpt}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#14110F] group-hover:text-[#A65C38]">
                  <span>Read Full Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeArticle.title}
          className="fixed inset-0 z-50 bg-[#14110F]/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveArticle(null)}
        >
          <article
            className="bg-[#FAF6F0] text-[#14110F] rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-[#C87A53]/25 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close article"
              onClick={() => setActiveArticle(null)}
              className="sticky top-4 float-right mr-4 mt-4 z-10 p-2 rounded-full bg-[#FAF6F0]/90 text-[#14110F] hover:bg-[#C87A53] hover:text-white shadow-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="h-52 sm:h-64 w-full overflow-hidden bg-[#14110F]">
              <img
                src={
                  activeArticle.coverImage ||
                  "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&q=85"
                }
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono-meta uppercase tracking-[0.14em] text-[#A65C38] mb-3">
                <span className="inline-flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  {activeArticle.category}
                </span>
                <span>·</span>
                <span>{activeArticle.readTime}</span>
              </div>

              <h3 className="font-serif-display text-3xl sm:text-4xl text-[#14110F] leading-tight mb-6">
                {activeArticle.title}
              </h3>

              <div className="space-y-4 text-base text-[#43352D] leading-relaxed">
                {activeArticle.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-[#C87A53]/20 flex flex-wrap items-center justify-between gap-4">
                <span className="text-sm text-[#6E5A4F]">
                  Ready to put this into practice?
                </span>
                <a
                  href="#booking"
                  onClick={() => setActiveArticle(null)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#14110F] hover:bg-[#C87A53] text-white text-xs font-semibold uppercase tracking-[0.12em] transition-colors"
                >
                  <span>Book a Trial Lesson</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
