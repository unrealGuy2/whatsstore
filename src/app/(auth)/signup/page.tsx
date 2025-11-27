'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './page.module.scss';
import { Loader2 } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    whatsapp: '',
    storeSlug: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // If typing in "Store Link", force it to be lowercase and no spaces
    if (e.target.name === 'storeSlug') {
      setFormData({
        ...formData,
        storeSlug: e.target.value.toLowerCase().replace(/\s+/g, '-')
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Sign up the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user created');

      // 2. Add their details to the 'profiles' table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id, // Link to Auth ID
            business_name: formData.businessName,
            whatsapp_number: formData.whatsapp,
            store_slug: formData.storeSlug,
          }
        ]);

      if (profileError) {
        // If profile creation fails, we technically have an orphaned auth user, 
        // but for MVP we just show the error (likely "Slug already taken")
        throw profileError;
      }

      // 3. Success! Redirect to Dashboard
      router.push('/dashboard');

    } catch (err: any) {
      console.error(err);
      // Handle "Duplicate Key" error nicely
      if (err.message?.includes('duplicate key value violates unique constraint')) {
        setError('That Store Link is already taken. Please choose another.');
      } else {
        setError(err.message || 'Something went wrong');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Create your Store</h1>
        <p>Start selling on WhatsApp in seconds.</p>

        {error && <div className={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSignup} className={styles.form}>
          
          {/* Business Name */}
          <div className={styles.inputGroup}>
            <label>Business Name</label>
            <input 
              name="businessName"
              type="text" 
              placeholder="e.g. Zeeluxe Fashion"
              required 
              value={formData.businessName}
              onChange={handleChange}
            />
          </div>

          {/* Store Link (Slug) */}
          <div className={styles.inputGroup}>
            <label>Store Link</label>
            <input 
              name="storeSlug"
              type="text" 
              placeholder="zeeluxe"
              required 
              value={formData.storeSlug}
              onChange={handleChange}
            />
            <span className={styles.helperText}>
              Your store will be: whatsstore.com/{formData.storeSlug || 'your-name'}
            </span>
          </div>

          {/* WhatsApp Number */}
          <div className={styles.inputGroup}>
            <label>WhatsApp Number</label>
            <input 
              name="whatsapp"
              type="tel" 
              placeholder="2348123456789"
              required 
              value={formData.whatsapp}
              onChange={handleChange}
            />
            <span className={styles.helperText}>
              Use international format without '+' (e.g. 234...)
            </span>
          </div>

          <hr style={{ borderColor: '#f3f4f6' }} />

          {/* Email */}
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input 
              name="email"
              type="email" 
              placeholder="you@example.com"
              required 
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className={styles.inputGroup}>
            <label>Password</label>
            <input 
              name="password"
              type="password" 
              placeholder="••••••••"
              required 
              minLength={6}
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} style={{ marginRight: '8px' }} />
                Creating Store...
              </>
            ) : (
              'Create Store'
            )}
          </button>
        </form>

        <div className={styles.loginLink}>
          Already have a store? <Link href="/login">Login here</Link>
        </div>
      </div>
    </div>
  );
}