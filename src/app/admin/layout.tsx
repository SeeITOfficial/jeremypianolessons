import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Studio Admin · Jeremy Piano",
  description: "Manage classes, bookings, hero video, and YouTube lessons.",
  manifest: "/admin-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Studio Admin",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
