'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import styles from './page.module.scss';
import { Loader2, Save } from 'lucide-react';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [formData, setFormData] = useState({
    businessName: '',
    whatsapp: '',
    storeSlug: '' // Slug should be read-only (hard to change URLs)
  });

  // 1. Load current data
  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) {
        setFormData({
          businessName: data.business_name,
          whatsapp: data.whatsapp_number,
          storeSlug: data.store_slug
        });
      }
      setLoading(false);
    };
    getProfile();
  }, []);

  // 2. Save updates
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user');

      const { error } = await supabase
        .from('profiles')
        .update({
          business_name: formData.businessName,
          whatsapp_number: formData.whatsapp
        })
        .eq('id', user.id);

      if (error) throw error;

      setMessage('Settings updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage(''), 3000);

    } catch (error) {
      alert('Error updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}><Loader2 className="animate-spin" /></div>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Store Settings</h1>
          <p>Manage your business details and contact info.</p>
        </div>

        {message && <div className={styles.successMessage}>{message}</div>}

        <form onSubmit={handleUpdate} className={styles.form}>
          
          {/* Read Only Slug */}
          <div className={styles.inputGroup}>
            <label>Store Link (Cannot be changed)</label>
            <input 
              type="text" 
              value={formData.storeSlug} 
              disabled 
              title="Contact support to change your link"
            />
            <span className={styles.helper}>
              Your store is live at: whatsstore.com/{formData.storeSlug}
            </span>
          </div>

          {/* Business Name */}
          <div className={styles.inputGroup}>
            <label>Business Name</label>
            <input 
              type="text" 
              value={formData.businessName}
              onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              required
            />
          </div>

          {/* WhatsApp Number */}
          <div className={styles.inputGroup}>
            <label>WhatsApp Number</label>
            <input 
              type="text" 
              value={formData.whatsapp}
              onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
              required
            />
            <span className={styles.helper}>
              Format: 2348012345678 (No + symbol)
            </span>
          </div>

          <button type="submit" className={styles.saveBtn} disabled={saving}>
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" style={{ marginRight: 8 }} />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} style={{ marginRight: 8 }} />
                Save Changes
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}