import PublicSite from "@/components/PublicSite";
import { getSiteContent } from "@/lib/content-store";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const content = await getSiteContent();
  return <PublicSite content={content} />;
}
