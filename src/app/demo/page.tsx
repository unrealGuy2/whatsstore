"use client";
import React, { useState } from 'react';
import styles from './demo.module.css';

// --- MOCK DATA (With Colors for Bad Network) ---
const PRODUCTS = [
  {
    id: 1,
    name: "BIO 101 Past Questions",
    price: "1,500",
    vendor: "Scholar James",
    category: "Academic",
    color: "#bfdbfe", // Light Blue
    initials: "PQ"
  },
  {
    id: 2,
    name: "Nike Air Force 1",
    price: "25,000",
    vendor: "Kicks By Sola",
    category: "Fashion",
    color: "#fecaca", // Light Red
    initials: "NK"
  },
  {
    id: 3,
    name: "MTN 10GB Data Plan",
    price: "3,500",
    vendor: "Connect Data",
    category: "Services",
    color: "#fde047", // Yellow
    initials: "MTN"
  },
  {
    id: 4,
    name: "Casio Scientific Calculator",
    price: "12,000",
    vendor: "Engr. Tobi",
    category: "Academic",
    color: "#d1d5db", // Grey
    initials: "FX"
  },
  {
    id: 5,
    name: "Student Perfume Oil",
    price: "3,000",
    vendor: "Scented Vibes",
    category: "Fashion",
    color: "#e9d5ff", // Purple
    initials: "OIL"
  },
  {
    id: 6,
    name: "Jollof + Turkey",
    price: "4,500",
    vendor: "Obodo Kitchens",
    category: "Food",
    color: "#fdba74", // Orange
    initials: "Rice"
  },
];

const CATEGORIES = ["All", "Academic", "Fashion", "Food", "Services"];

export default function FacultyDemo() {
  const [activeCat, setActiveCat] = useState("All");
  const [showNotice, setShowNotice] = useState(true);

  const filteredProducts = activeCat === "All" 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCat);

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.badge}>OFFICIAL</div>
        <h1 className={styles.title}>Physical Sciences<br/><span>Marketplace</span></h1>
        <p className={styles.subtitle}>Powered by the Faculty Association</p>
      </header>

      {/* Announcement Banner (New Feature) */}
      {showNotice && (
        <div className={styles.notice}>
          <div className={styles.noticeContent}>
            <span className={styles.noticeIcon}>📢</span>
            <p>
              <strong>Faculty News:</strong> Want to be a Verified Vendor? 
              <span className={styles.link}> Get your Blue Tick here!</span>
            </p>
          </div>
          <button onClick={() => setShowNotice(false)} className={styles.closeBtn}>×</button>
        </div>
      )}

      {/* Search Bar */}
      <div className={styles.searchContainer}>
        <input type="text" placeholder="Search for handouts, shoes, data..." className={styles.searchBar} readOnly />
        <span className={styles.searchIcon}>🔍</span>
      </div>

      {/* Categories */}
      <div className={styles.categoryScroll}>
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            className={`${styles.catBtn} ${activeCat === cat ? styles.active : ''}`}
            onClick={() => setActiveCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {filteredProducts.map(product => (
          <div key={product.id} className={styles.card}>
            {/* Colored Box Fallback (Network Safe) */}
            <div 
              className={styles.imageWrapper} 
              style={{
                backgroundColor: product.color, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}
            >
              <span style={{fontWeight: 'bold', fontSize: '20px', color: '#444'}}>
                {product.initials}
              </span>
              <span className={styles.catTag}>{product.category}</span>
            </div>

            <div className={styles.cardBody}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.vendor}>Sold by: {product.vendor}</p>
              <div className={styles.row}>
                <span className={styles.price}>₦{product.price}</span>
                <button className={styles.buyBtn}>Chat</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}