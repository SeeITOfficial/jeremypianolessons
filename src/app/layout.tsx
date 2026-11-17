import type { Metadata } from "next";
import { JetBrains_Mono, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jeremy Piano Studio · Fun, Modern Piano Lessons in Entebbe",
  description:
    "Friendly 1-on-1 piano classes in Entebbe for kids, teens, and adult beginners. Learn pop, gospel, classical, and playing by ear.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Jeremy Piano Studio · Piano Lessons for All Ages in Entebbe",
    description:
      "Learn Piano. Love Music. Patient, joyful 1-on-1 piano classes for kids, teens, and adult beginners in Entebbe.",
    type: "website",
    locale: "en_UG",
    images: [
      {
        url: "https://images.unsplash.com/photo-1552422535-c45813c61732?w=1200&q=85",
        width: 1200,
        height: 630,
        alt: "Jeremy Piano Studio in Entebbe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeremy Piano Studio · Piano Lessons for All Ages in Entebbe",
    description:
      "Fun, step-by-step 1-on-1 piano lessons for kids, teens, and adult beginners in Entebbe.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen antialiased selection:bg-[#4F46E5]/20 selection:text-[#0F172A]">
        {children}
      </body>
    </html>
  );
}
