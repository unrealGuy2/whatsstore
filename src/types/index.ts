export interface Vendor {
  id: string; 
  business_name: string;
  store_slug: string; 
  whatsapp_number: string;
  avatar_url?: string;
}

export interface Product {
  id: string;
  vendor_id: string;
  name: string;
  price: number;
  description?: string;
  image_url: string;
  created_at: string;
}

// Ensure this is here!
export interface CartItem extends Product {
  quantity: number;
}