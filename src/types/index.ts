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
  category: string; // <--- NEW FIELD
  created_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}