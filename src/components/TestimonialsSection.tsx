import { Star } from "lucide-react";
import type { TestimonialItem } from "@/lib/types";

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
}

const AVATAR_COLORS = [
  "bg-rose-500",
  "bg-indigo-600",
  "bg-emerald-600",
];

export default function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  const published = testimonials.filter((t) => t.published);
  if (published.length === 0) return null;

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold mb-3">
            Happy Learners
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-5xl text-slate-900">
            Loved by kids, parents & adults
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {published.map((item, idx) => (
            <div
              key={item.id}
              className="rounded-3xl bg-[#F8FAFC] border border-slate-200 p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-amber-400 mb-3">
                  {Array.from({ length: Math.max(1, Math.min(5, item.rating)) }).map(
                    (_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    )
                  )}
                </div>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-5">
                  “{item.quote}”
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200/70">
                <div
                  className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-display font-bold text-base ${
                    AVATAR_COLORS[idx % AVATAR_COLORS.length]
                  }`}
                >
                  {item.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-sm text-slate-900">
                    {item.name}
                  </div>
                  <div className="text-xs text-slate-500">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
