'use client';

import { useEffect, useState, use } from 'react';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import styles from './page.module.scss';
import { Product, Vendor } from '@/types';
import { useCartStore } from '@/store/useCartStore';
import { Loader2 } from 'lucide-react';
// 1. Import the Modal
import CartModal from '@/components/store/CartModal';

export default function StorePage({ params }: { params: Promise<{ storeName: string }> }) {
  const { storeName } = use(params);
  
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 2. Add state for the Modal
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = useCartStore((state) => state.addToCart);
  const cart = useCartStore((state) => state.cart);
  const cartTotal = useCartStore((state) => state.totalPrice());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: vendorData, error: vendorError } = await supabase
          .from('profiles')
          .select('*')
          .eq('store_slug', storeName)
          .single();

        if (vendorError || !vendorData) return;
        setVendor(vendorData);

        const { data: productData } = await supabase
          .from('products')
          .select('*')
          .eq('vendor_id', vendorData.id)
          .eq('is_active', true);

        setProducts(productData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [storeName]);

  // (We removed handleCheckout from here because it's now in the Modal!)

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

      <div className={styles.grid}>
        {products.map((product) => (
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
              
              <button 
                className={styles.addBtn}
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        // 3. Update onClick to open Modal
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

      {/* 4. Render the Modal */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        vendor={vendor}
      />
    </div>
  );
}