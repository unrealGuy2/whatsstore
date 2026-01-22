import type { Metadata } from "next";
import { supabase } from "@/lib/supabase";

type Props = {
  params: Promise<{ storeName: string }>;
  children: React.ReactNode;
};


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  
  const { storeName } = await params;

  // 2. Fetch the Vendor Name from Supabase
  const { data: vendor } = await supabase
    .from("profiles")
    .select("business_name, whatsapp_number")
    .eq("store_slug", storeName)
    .single();

  
  if (!vendor) {
    return {
      title: "WhatsStore",
      description: "Mini E-commerce Store for WhatsApp",
    };
  }

  
  return {
    title: `${vendor.business_name} | Shop on WhatsApp`,
    description: `Order directly from ${vendor.business_name} on WhatsApp. Click to view products.`,
    openGraph: {
      title: vendor.business_name,
      description: `Order directly from ${vendor.business_name} on WhatsApp.`,
      
    },
  };
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}