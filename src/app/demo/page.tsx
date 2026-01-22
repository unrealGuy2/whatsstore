// src/app/demo/page.tsx
"use client";
import React, { useState } from 'react';
import styles from './demo.module.css';

// --- MOCK DATA ---
const PRODUCTS = [
  {
    id: 1,
    name: "BIO 101 Past Questions (2015-2024)",
    price: "1,500",
    vendor: "Scholar James",
    category: "Academic",
    image: "https://placehold.co/600x400/2563eb/ffffff?text=BIO+101+PQ",
  },
  {
    id: 2,
    name: "Nike Air Force 1 (White)",
    price: "25,000",
    vendor: "Kicks By Sola",
    category: "Fashion",
    image: "https://placehold.co/600x400/e11d48/ffffff?text=Nike+Sneakers",
  },
  {
    id: 3,
    name: "MTN 10GB Data Plan",
    price: "3,500",
    vendor: "Connect Data",
    category: "Services",
    image: "https://placehold.co/600x400/fbbf24/000000?text=MTN+DATA",
  },
  {
    id: 4,
    name: "Casio Scientific Calculator",
    price: "12,000",
    vendor: "Engr. Tobi",
    category: "Academic",
    image: "https://placehold.co/600x400/4b5563/ffffff?text=Calculator",
  },
  {
    id: 5,
    name: "Student Perfume Oil (Vanilla)",
    price: "3,000",
    vendor: "Scented Vibes",
    category: "Fashion",
    image: "https://placehold.co/600x400/9333ea/ffffff?text=Perfume",
  },
  {
    id: 6,
    name: "Jollof + Turkey (Obodo Special)",
    price: "4,500",
    vendor: "Obodo Kitchens",
    category: "Food",
    image: "https://placehold.co/600x400/ea580c/ffffff?text=Jollof+Rice",
  },
];

const CATEGORIES = ["All", "Academic", "Fashion", "Food", "Services"];

export default function FacultyDemo() {
  const [activeCat, setActiveCat] = useState("All");

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
            <div className={styles.imageWrapper}>
              <img src={product.image} alt={product.name} className={styles.productImage} />
              <span className={styles.catTag}>{product.category}</span>
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.vendor}>Sold by: {product.vendor}</p>
              <div className={styles.row}>
                <span className={styles.price}>₦{product.price}</span>
                <button className={styles.buyBtn}>Chat Vendor</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}