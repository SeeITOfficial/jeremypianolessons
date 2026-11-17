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
  metadataBase: new URL("https://jeremypianolessons.vercel.app"),
  title: "Jeremy Piano Studio · Fun, Modern Piano Lessons in Entebbe",
  description:
    "Friendly 1-on-1 piano classes in Entebbe for kids, teens, and adult beginners. Learn pop, gospel, classical, and playing by ear.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    url: "https://jeremypianolessons.vercel.app",
    siteName: "Jeremy Piano Studio",
    title: "Jeremy Piano Studio · Piano Lessons for All Ages in Entebbe",
    description:
      "Learn Piano. Love Music. Patient, joyful 1-on-1 piano classes for kids, teens, and adult beginners in Entebbe.",
    type: "website",
    locale: "en_UG",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt: "Jeremy Piano Studio · Private Piano Lessons in Entebbe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jeremy Piano Studio · Piano Lessons for All Ages in Entebbe",
    description:
      "Fun, step-by-step 1-on-1 piano lessons for kids, teens, and adult beginners in Entebbe.",
    images: ["/og-image.jpg"],
  },
};

const adminPwaBootstrapScript = `
(function() {
  try {
    if (!window.location.pathname.startsWith("/admin")) return;
    window.__studioInstallPrompt = window.__studioInstallPrompt || null;
    window.addEventListener("beforeinstallprompt", function(e) {
      e.preventDefault();
      window.__studioInstallPrompt = e;
      window.dispatchEvent(new Event("studio-install-ready"));
    });
    window.addEventListener("appinstalled", function() {
      window.__studioInstallPrompt = null;
      window.dispatchEvent(new Event("studio-install-done"));
    });
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(function() {});
    }
  } catch (_) {}
})();
`;

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
        <script dangerouslySetInnerHTML={{ __html: adminPwaBootstrapScript }} />
        {children}
      </body>
    </html>
  );
}
