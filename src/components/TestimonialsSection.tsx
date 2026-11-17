import { Star } from "lucide-react";
import type { TestimonialItem } from "@/lib/types";

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
}

export default function TestimonialsSection({
  testimonials,
}: TestimonialsSectionProps) {
  const published = testimonials.filter((t) => t.published);
  if (published.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-[#FAF6F0]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block text-xs font-mono-meta uppercase tracking-[0.2em] text-[#A65C38] mb-3">
            Student Stories
          </span>
          <h2 className="font-serif-display text-4xl sm:text-5xl text-[#14110F]">
            Voices from the <em className="italic text-[#A65C38]">studio</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {published.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#F2EAE0] border border-[#C87A53]/20 p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 text-[#C87A53] mb-4">
                  {Array.from({ length: Math.max(1, Math.min(5, item.rating)) }).map(
                    (_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    )
                  )}
                </div>
                <p className="font-serif-display italic text-xl sm:text-2xl text-[#14110F] leading-snug mb-6">
                  “{item.quote}”
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#C87A53]/15">
                <div className="w-10 h-10 rounded-full bg-[#14110F] text-[#FAF6F0] flex items-center justify-center font-serif-display text-lg">
                  {item.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-sm text-[#14110F]">
                    {item.name}
                  </div>
                  <div className="text-xs text-[#6E5A4F]">{item.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
