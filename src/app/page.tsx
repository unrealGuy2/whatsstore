import Link from 'next/link';
import styles from './page.module.scss';
import { Store } from 'lucide-react';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* NEW: Simple Navbar */}
      <nav style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 2rem',
        borderBottom: '1px solid #e9edef',
        background: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold', fontSize: '1.2rem', color: '#25D366' }}>
          <Store /> WhatsStore
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/login" style={{ fontWeight: 500, color: '#666' }}>
            Login
          </Link>
          <Link href="/signup" style={{ 
            backgroundColor: '#25D366', 
            color: 'white', 
            padding: '0.5rem 1rem', 
            borderRadius: '8px',
            fontWeight: 500
          }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1>
          Sell on WhatsApp <br />
          <span>Like a Pro.</span>
        </h1>
        <p>
          Turn your WhatsApp number into a powerful mini-store. 
          Upload products, share your link, and get orders directly as messages.
        </p>
        
        <Link href="/signup" className={styles.ctaButton}>
          Create My Store
        </Link>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2>How It Works</h2>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>1. Create Account</h3>
            <p>Sign up and get your unique store link instantly.</p>
          </div>
          <div className={styles.card}>
            <h3>2. Add Products</h3>
            <p>Upload photos, prices, and details to your dashboard.</p>
          </div>
          <div className={styles.card}>
            <h3>3. Get Orders</h3>
            <p>Customers checkout and send the order to your WhatsApp.</p>
          </div>
        </div>
      </section>
    </main>
  );
}