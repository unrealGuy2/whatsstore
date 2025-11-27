'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Loader2, Upload } from 'lucide-react';
import styles from './ProductModal.module.scss';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void; // To refresh the list after adding
}

export default function ProductModal({ isOpen, onClose, onProductAdded }: ProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let imageUrl = null;

      // 2. Upload Image (if selected)
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        // Get the Public URL
        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrlData.publicUrl;
      }

      // 3. Insert into Database
      const { error: dbError } = await supabase
        .from('products')
        .insert([
          {
            vendor_id: user.id,
            name: formData.name,
            price: parseFloat(formData.price),
            description: formData.description,
            image_url: imageUrl,
          }
        ]);

      if (dbError) throw dbError;

      // 4. Cleanup and Close
      setFormData({ name: '', price: '', description: '' });
      setImageFile(null);
      onProductAdded(); // Tell parent to refresh
      onClose();

    } catch (error: any) {
      alert('Error adding product: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Add New Product</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Product Name */}
          <div>
            <label>Product Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Vintage T-Shirt"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Price */}
          <div>
            <label>Price (₦)</label>
            <input 
              type="number" 
              required
              placeholder="e.g. 5000"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label>Product Image</label>
            <div style={{ position: 'relative' }}>
              <input 
                type="file" 
                accept="image/*"
                onChange={e => setImageFile(e.target.files?.[0] || null)}
                style={{ paddingLeft: '40px' }}
              />
              <Upload size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: '#666' }} />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Cancel
            </button>
            <button type="submit" className={styles.saveBtn} disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Save Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}