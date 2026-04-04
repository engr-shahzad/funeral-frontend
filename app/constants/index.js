export const API_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : '/api';

export const SOCKET_URL =
  typeof window !== 'undefined' && window.location.host.indexOf('localhost') >= 0
    ? 'http://127.0.0.1:3000'
    : typeof window !== 'undefined'
    ? window.location.host
    : 'http://localhost:3000';

export const ROLES = {
  Admin: 'ROLE ADMIN',
  Member: 'ROLE MEMBER',
  Merchant: 'ROLE MERCHANT'
};

export const CART_ITEMS = 'cart_items';
export const CART_TOTAL = 'cart_total';
export const CART_ID = 'cart_id';

export const CART_ITEM_STATUS = {
  Processing: 'Processing',
  Shipped: 'Shipped',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
  Not_processed: 'Not processed'
};

export const MERCHANT_STATUS = {
  Rejected: 'Rejected',
  Approved: 'Approved',
  Waiting_Approval: 'Waiting Approval'
};

export const REVIEW_STATUS = {
  Rejected: 'Rejected',
  Approved: 'Approved',
  Waiting_Approval: 'Waiting Approval'
};

export const EMAIL_PROVIDER = {
  Email: 'Email',
  Google: 'Google',
  Facebook: 'Facebook'
};
