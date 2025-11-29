'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { X, Loader2, Upload } from 'lucide-react';
import styles from './ProductModal.module.scss';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductAdded: () => void;
}

export default function ProductModal({ isOpen, onClose, onProductAdded }: ProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: 'General', // Default value
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      let imageUrl = null;

      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(fileName, imageFile);

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);
        
        imageUrl = publicUrlData.publicUrl;
      }

      const { error: dbError } = await supabase
        .from('products')
        .insert([
          {
            vendor_id: user.id,
            name: formData.name,
            price: parseFloat(formData.price),
            description: formData.description,
            image_url: imageUrl,
            category: formData.category, // Save the category
          }
        ]);

      if (dbError) throw dbError;

      setFormData({ name: '', price: '', description: '', category: 'General' });
      setImageFile(null);
      onProductAdded();
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
          {/* Name */}
          <div>
            <label>Product Name</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Jollof Rice"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {/* Price */}
            <div>
              <label>Price (₦)</label>
              <input 
                type="number" 
                required
                placeholder="1500"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
              />
            </div>

            {/* Category Input */}
            <div>
              <label>Category</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Food"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                list="category-suggestions" 
              />
              {/* Simple autocomplete helper */}
              <datalist id="category-suggestions">
                <option value="Food" />
                <option value="Drinks" />
                <option value="Snacks" />
                <option value="Shoes" />
                <option value="Clothes" />
              </datalist>
            </div>
          </div>

          {/* Image */}
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