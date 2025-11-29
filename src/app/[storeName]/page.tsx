'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import styles from './page.module.scss';
import { Product, Vendor } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { Loader2 } from 'lucide-react';
import CartModal from '@/components/store/CartModal';

export default function StorePage({ params }: { params: Promise<{ storeName: string }> }) {
  const { storeName } = use(params);
  
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((state) => state.cart);
  const cartTotal = useCartStore((state) => state.totalPrice());

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Get Vendor
        const { data: vendorData, error: vendorError } = await supabase
          .from('profiles')
          .select('*')
          .eq('store_slug', storeName)
          .single();

        if (vendorError || !vendorData) return;
        setVendor(vendorData);

        // 2. Get Products (Ordered by category so they group nicely)
        const { data: productData } = await supabase
          .from('products')
          .select('*')
          .eq('vendor_id', vendorData.id)
          .eq('is_active', true)
          .order('category', { ascending: true }); // Important for grouping

        setProducts(productData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [storeName]);

  // --- HELPER: Group products by category ---
  const groupedProducts = products.reduce((acc, product) => {
    const cat = product.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Loader2 className="animate-spin" />
    </div>
  );

  if (!vendor) return notFound();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>{vendor.business_name}</h1>
        <p>WhatsApp: +{vendor.whatsapp_number}</p>
      </header>

      {/* NEW: Render Groups */}
      {Object.keys(groupedProducts).length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>No products yet.</p>
      ) : (
        Object.entries(groupedProducts).map(([category, items]) => (
          <section key={category} style={{ marginBottom: '2rem' }}>
            {/* Category Title */}
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 'bold', 
              margin: '0 auto 1rem', 
              maxWidth: '1024px', 
              padding: '0 1rem',
              color: '#111b21',
              borderLeft: '4px solid #25D366', // Little green accent
              paddingLeft: '12px'
            }}>
              {category}
            </h2>

            {/* Grid for this Category */}
            <div className={styles.grid}>
              {items.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.imageWrapper}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} />
                    ) : (
                      <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#999' }}>
                        No Image
                      </div>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <h3>{product.name}</h3>
                    <p className={styles.price}>₦{product.price.toLocaleString()}</p>
                    <button className={styles.addBtn} onClick={() => addToCart(product)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))
      )}

      {cart.length > 0 && (
        <div className={styles.floatingCart} onClick={() => setIsCartOpen(true)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ background: 'white', color: 'black', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '12px', fontWeight: 'bold' }}>
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </div>
            <span>View Cart</span>
          </div>
          <span>₦{cartTotal.toLocaleString()}</span>
        </div>
      )}

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        vendor={vendor}
      />
    </div>
  );
}