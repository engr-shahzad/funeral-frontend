/**
 * Order Summary Component
 */
import "./OrderSummary.css"
import React from 'react';

const OrderSummary = ({ cartItems, cartTotal, handleRemoveFromCart }) => {
  const TAX_RATE = 0.08; 
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = cartTotal - subtotal;

  return (
    <div className="order-summary-container">
      <div className="order-summary-card">
        <h4 className="summary-title">Order Summary</h4>

        <div className="items-list">
          {cartItems.map((item, index) => (
            <div key={index} className="summary-item">
              <div className="item-image-wrapper">
                <img
                  src={item.imageUrl || '/images/placeholder-image.png'}
                  alt={item.name}
                  className="item-image"
                />
              </div>
              
              <div className="item-info">
                <p className="item-name">{item.name}</p>
                <p className="item-quantity">Qty: {item.quantity} × ${item.price}</p>
                {/* Remove button added here */}
                <button 
                  className="remove-item-btn" 
                  onClick={() => handleRemoveFromCart(item)}
                  title="Remove item"
                >
                  Remove
                </button>
              </div>

              <div className="item-price-total">
                <p>${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="cost-breakdown">
          <div className="cost-row">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="cost-row">
            <span>Tax (8%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="cost-row shipping-row">
            <span>Shipping</span>
            <span className="free-text">FREE</span>
          </div>
          
          <div className="total-divider"></div>
          
          <div className="cost-row grand-total">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="trust-footer">
          <i className="fa fa-lock"></i>
          <span>100% Secure Checkout</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;