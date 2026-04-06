// ─── API URL ───────────────────────────────────────────────────────────────────
// Priority:
//  1. Non-localhost value baked in by webpack at build time (explicit override)
//  2. Auto-detect from window.location.origin when running in a production browser
//  3. Localhost fallback for local dev / SSR
const _baked = process.env.API_URL;

const _isLocalhost = (host) =>
  host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.');

export const API_URL = (() => {
  // If an explicit non-localhost URL was set as an env var at build time → use it
  if (_baked) {
    try {
      const { hostname } = new URL(_baked);
      if (!_isLocalhost(hostname)) return _baked;
    } catch (_) {}
  }

  // In the browser on a real domain → derive API URL from current origin
  if (typeof window !== 'undefined' && !_isLocalhost(window.location.hostname)) {
    return `${window.location.origin}/api`;
  }

  // Local dev or SSR fallback
  return 'http://localhost:3000/api';
})();

// ─── Socket URL ────────────────────────────────────────────────────────────────
export const SOCKET_URL = (() => {
  if (typeof window !== 'undefined') {
    // Production browser — use same origin (no port)
    if (!_isLocalhost(window.location.hostname)) {
      return window.location.origin;
    }
    // Local dev — backend socket is on port 3000
    return 'http://127.0.0.1:3000';
  }
  return 'http://localhost:3000';
})();

// ─── App constants ─────────────────────────────────────────────────────────────
export const ROLES = {
  Admin:    'ROLE ADMIN',
  Member:   'ROLE MEMBER',
  Merchant: 'ROLE MERCHANT'
};

export const CART_ITEMS = 'cart_items';
export const CART_TOTAL = 'cart_total';
export const CART_ID    = 'cart_id';

export const CART_ITEM_STATUS = {
  Processing:    'Processing',
  Shipped:       'Shipped',
  Delivered:     'Delivered',
  Cancelled:     'Cancelled',
  Not_processed: 'Not processed'
};

export const MERCHANT_STATUS = {
  Rejected:         'Rejected',
  Approved:         'Approved',
  Waiting_Approval: 'Waiting Approval'
};

export const REVIEW_STATUS = {
  Rejected:         'Rejected',
  Approved:         'Approved',
  Waiting_Approval: 'Waiting Approval'
};

export const EMAIL_PROVIDER = {
  Email:    'Email',
  Google:   'Google',
  Facebook: 'Facebook'
};
