'use client';

import { useCartStore } from '@/store/useCartStore';
import { X, Plus, Minus, MessageCircle } from 'lucide-react';
import styles from './CartModal.module.scss';
import { Vendor } from '@/types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor; // We need the vendor info to send the WhatsApp msg
}

export default function CartModal({ isOpen, onClose, vendor }: CartModalProps) {
  const cart = useCartStore((state) => state.cart);
  const increase = useCartStore((state) => state.increaseQuantity);
  const decrease = useCartStore((state) => state.decreaseQuantity);
  const total = useCartStore((state) => state.totalPrice());

  if (!isOpen) return null;

  const handleCheckout = () => {
    let message = `Hello *${vendor.business_name}*, I want to place an order:\n\n`;
    
    cart.forEach((item) => {
      message += `▪️ ${item.name} (x${item.quantity}) - ₦${(item.price * item.quantity).toLocaleString()}\n`;
    });

    message += `\n*Total: ₦${total.toLocaleString()}*`;
    message += `\n\nPlease confirm my order.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${vendor.whatsapp_number}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Your Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        <div className={styles.cartList}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
              Your cart is empty.
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  {item.image_url && <img src={item.image_url} alt={item.name} />}
                </div>
                <div className={styles.itemDetails}>
                  <h3>{item.name}</h3>
                  <p className={styles.price}>₦{item.price.toLocaleString()}</p>
                  
                  <div className={styles.controls}>
                    <button onClick={() => decrease(item.id)}><Minus size={14} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => increase(item.id)}><Plus size={14} /></button>
                  </div>
                </div>
                <div style={{ fontWeight: 600 }}>
                   ₦{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.footer}>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
            <button className={styles.checkoutBtn} onClick={handleCheckout}>
              Checkout on WhatsApp <MessageCircle size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}