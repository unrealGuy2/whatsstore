'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import ProductModal from '@/components/dashboard/ProductModal';
import { Plus, Loader2, Trash2, Share2, Check } from 'lucide-react';
import styles from './page.module.scss';
import { Product } from '@/types';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  // New State for the Share Link
  const [storeUrl, setStoreUrl] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 1. Fetch Products
        const { data: productData } = await supabase
          .from('products')
          .select('*')
          .eq('vendor_id', user.id)
          .order('created_at', { ascending: false });

        setProducts(productData || []);

        // 2. Fetch Profile to get the Link
        const { data: profile } = await supabase
          .from('profiles')
          .select('store_slug')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          // Construct the full URL based on where the app is running
          const origin = window.location.origin;
          setStoreUrl(`${origin}/${profile.store_slug}`);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    setDeletingId(productId);
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (error) throw error;
      setProducts((prev) => prev.filter(p => p.id !== productId));
    } catch (error) {
      alert('Error deleting product');
    } finally {
      setDeletingId(null);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div>
      {/* NEW: Share Your Store Section */}
      {!loading && storeUrl && (
        <div className={styles.shareSection}>
          <div>
            <h2>Share your Store</h2>
            <p>Copy this link and post it on your WhatsApp Status!</p>
          </div>
          <div className={styles.linkBox}>
            <input type="text" readOnly value={storeUrl} />
            <button onClick={copyToClipboard} className={styles.copyBtn}>
              {copied ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Check size={14} /> Copied
                </span>
              ) : (
                'Copy Link'
              )}
            </button>
          </div>
        </div>
      )}

      <div className={styles.header}>
        <h1>My Products</h1>
        <button onClick={() => setIsModalOpen(true)} className={styles.addBtn}>
          <Plus size={20} /> Add Product
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Loader2 className="animate-spin" style={{ margin: '0 auto' }} />
        </div>
      ) : (
        <>
          {products.length === 0 ? (
            <div className={styles.emptyState}>
              <p>You haven't added any products yet.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {products.map((product) => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.imageWrapper}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} />
                    ) : (
                      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
                        No Image
                      </div>
                    )}
                  </div>
                  <div className={styles.cardContent}>
                    <div className={styles.row}>
                      <h3>{product.name}</h3>
                      <button 
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                      >
                        {deletingId === product.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                    <p className={styles.price}>₦{product.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onProductAdded={fetchProducts}
      />
    </div>
  );
}