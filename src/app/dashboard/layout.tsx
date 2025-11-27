'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import styles from './layout.module.scss';
import { LogOut, ExternalLink, Store, Loader2, Settings } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [storeLink, setStoreLink] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      // 1. Get Auth User
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // 2. Get Profile (to find the slug for "View Shop")
      const { data: profile } = await supabase
        .from('profiles')
        .select('store_slug')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        setStoreLink(`/${profile.store_slug}`);
      }

      setLoading(false);
    };
    
    checkUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className={styles.dashboardContainer}>
      {/* Top Navigation Bar */}
      <nav className={styles.navbar}>
        <div className={styles.navContent}>
          <Link href="/dashboard" className={styles.brand}>
            <Store size={24} />
            <span>WhatsStore</span>
          </Link>

          <div className={styles.navActions}>
            {/* View Shop Link */}
            {storeLink && (
              <Link href={storeLink} className={styles.linkBtn} target="_blank">
                View Shop <ExternalLink size={16} />
              </Link>
            )}

            {/* Settings Link */}
            <Link href="/dashboard/settings" className={styles.linkBtn}>
              Settings <Settings size={16} />
            </Link>
            
            {/* Logout Button */}
            <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Main Page Content */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}