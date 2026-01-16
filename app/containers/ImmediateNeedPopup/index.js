import React, { useState, useEffect } from 'react';
import './ImmediateNeedPopup.css';

export default function ImmediateNeedPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 800); // slight delay like real sites

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="immediate-popup">
      <button
        className="popup-close"
        onClick={() => setVisible(false)}
        aria-label="Close popup"
      >
        ×
      </button>

      <h2>Immediate Need</h2>

      <p>
        We stand ready to assist you. If a death has occurred,
        please call us on the number below:
      </p>

      <div className="popup-phone">
        <a href="tel:16057873940">1-605-787-3940</a>
      </div>

      <button
        className="popup-dismiss"
        onClick={() => setVisible(false)}
      >
        Close this window
      </button>
    </div>
  );
}
