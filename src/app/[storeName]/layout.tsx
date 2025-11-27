import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

type Props = {
  params: Promise<{ storeName: string }>;
  children: React.ReactNode;
};

// This function runs on the server to generate the WhatsApp preview
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // 1. Unwrap the params (Next.js 15 requirement)
  const { storeName } = await params;

  // 2. Fetch the Vendor Name from Supabase
  const { data: vendor } = await supabase
    .from("profiles")
    .select("business_name, whatsapp_number")
    .eq("store_slug", storeName)
    .single();

  // 3. If no vendor found, return generic data
  if (!vendor) {
    return {
      title: "WhatsStore",
      description: "Mini E-commerce Store for WhatsApp",
    };
  }

  // 4. Return the customized Social Card
  return {
    title: `${vendor.business_name} | Shop on WhatsApp`,
    description: `Order directly from ${vendor.business_name} on WhatsApp. Click to view products.`,
    openGraph: {
      title: vendor.business_name,
      description: `Order directly from ${vendor.business_name} on WhatsApp.`,
      // If you had an avatar_url, you would add 'images: [vendor.avatar_url]' here
    },
  };
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}