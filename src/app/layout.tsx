import type { Metadata } from "next";
import { Instrument_Serif, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
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
  title: "Jeremy Piano Studio · Private Piano Lessons in Entebbe",
  description:
    "Patient, personalised 1-on-1 piano lessons in Entebbe, Uganda for children, teens, and adults. Classical, contemporary, gospel, and ear training.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Jeremy Piano Studio · Private Piano Lessons in Entebbe",
    description:
      "Inspire. Learn. Play. Personalised 1-on-1 piano coaching for children, teens, and adults in Entebbe, Uganda.",
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
    title: "Jeremy Piano Studio · Private Piano Lessons in Entebbe",
    description:
      "Personalised 1-on-1 piano lessons for children, teens, and adults in Entebbe, Uganda.",
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
      className={`${instrumentSerif.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen antialiased selection:bg-[#C87A53]/25 selection:text-[#14110F]">
        {children}
      </body>
    </html>
  );
}
