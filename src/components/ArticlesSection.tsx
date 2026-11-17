"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Lightbulb, X } from "lucide-react";
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
    <section id="guides" className="py-10 sm:py-14 bg-[#EEF2F7] text-slate-900 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </span>
            <h2 className="font-display font-bold text-xl text-slate-900">
              Quick Starter Tips
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Short reads for parents & first-time players
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {published.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() => setActiveArticle(article)}
              className="group text-left rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 px-5 py-4 transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="text-[11px] font-semibold text-indigo-600 mb-0.5">
                  {article.category} · {article.readTime}
                </div>
                <div className="font-display font-bold text-base text-slate-900 group-hover:text-[#4F46E5] truncate">
                  {article.title}
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#4F46E5] group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>
      </div>

      {/* Quick Tip Modal */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activeArticle.title}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActiveArticle(null)}
        >
          <article
            className="bg-white text-slate-900 rounded-3xl max-w-xl w-full max-h-[88vh] overflow-y-auto shadow-2xl border border-slate-200 relative p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close tip"
              onClick={() => setActiveArticle(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
              {activeArticle.category} · {activeArticle.readTime}
            </span>

            <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 pr-8 mb-4">
              {activeArticle.title}
            </h3>

            <div className="space-y-3.5 text-sm sm:text-base text-slate-600 leading-relaxed">
              {activeArticle.content.map((paragraph, idx) => (
                <p key={idx}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100 flex justify-end">
              <a
                href="#booking"
                onClick={() => setActiveArticle(null)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-semibold"
              >
                <span>Book a Trial Lesson</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
