/**
 * Admin Orders View (View Only)
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../constants';

const OrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') ||
      localStorage.getItem('authToken') ||
      localStorage.getItem('access_token');
    if (!token) return {};
    // Token from backend already includes 'Bearer ' prefix
    return { Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}` };
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setFetchError('');
      const response = await axios.get(`${API_URL}/order`, {
        params: { page: currentPage, limit: 20 },
        headers: getAuthHeaders()
      });
      console.log('Orders API response:', response.data);
      setOrders(response.data.orders || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalOrders(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching orders:', error);
      const status = error.response?.status;
      const msg = error.response?.data?.error || error.message;
      if (status === 401) {
        setFetchError('Authentication failed. Please login as admin first.');
      } else {
        setFetchError(`Failed to fetch orders: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const viewOrderDetails = async (order) => {
    try {
      const response = await axios.get(`${API_URL}/order/${order._id}`, {
        headers: getAuthHeaders()
      });
      setSelectedOrder(response.data.order);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setSelectedOrder(order);
      setShowDetailModal(true);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order._id?.toLowerCase().includes(search.toLowerCase()) ||
      order.billingDetails?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.billingDetails?.email?.toLowerCase().includes(search.toLowerCase()) ||
      order.obituaryName?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || order.orderStatus === statusFilter;
    const matchesPayment = !paymentFilter || order.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const getPaymentStatusBadge = (status) => {
    const badges = {
      succeeded: 'success',
      pending: 'warning',
      failed: 'danger',
      cancelled: 'neutral'
    };
    return badges[status] || 'neutral';
  };

  const getOrderStatusBadge = (status) => {
    const badges = {
      delivered: 'success',
      shipped: 'info',
      processing: 'warning',
      pending: 'neutral',
      cancelled: 'danger'
    };
    return badges[status] || 'neutral';
  };

  return (
    <div className="admin-orders">
      <div className="admin-page-header">
        <h1>Orders</h1>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Total: {totalOrders} orders
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="search-input">
          <i className="fa fa-search" />
          <input
            type="text"
            placeholder="Search by order ID, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
          <option value="">All Payments</option>
          <option value="succeeded">Succeeded</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Error Message */}
      {fetchError && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '15px', marginBottom: '20px', color: '#dc2626' }}>
          <strong>Error:</strong> {fetchError}
          <button onClick={fetchOrders} style={{ marginLeft: '10px', padding: '4px 12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Retry
          </button>
        </div>
      )}

      {/* Orders Table */}
      <div className="admin-card">
        {loading ? (
          <div className="admin-loading">
            <div className="spinner" />
            <p>Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="admin-empty">
            <i className="icon-bag" />
            <h3>No orders found</h3>
            <p>Orders will appear here once customers make purchases</p>
          </div>
        ) : (
          <>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Obituary</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(order => (
                    <tr key={order._id}>
                      <td>
                        <code style={{ fontSize: '12px', background: '#f3f4f6', padding: '2px 6px' }}>
                          #{order._id.slice(-8)}
                        </code>
                      </td>
                      <td>
                        <strong>{order.billingDetails?.name || 'Guest'}</strong>
                        {order.billingDetails?.email && (
                          <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>
                            {order.billingDetails.email}
                          </p>
                        )}
                      </td>
                      <td>
                        {order.obituaryName || '-'}
                      </td>
                      <td>
                        <strong>{formatCurrency(order.total)}</strong>
                        {order.totalTax > 0 && (
                          <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#6b7280' }}>
                            +{formatCurrency(order.totalTax)} tax
                          </p>
                        )}
                      </td>
                      <td>
                        <span className={`status-badge ${getPaymentStatusBadge(order.paymentStatus)}`}>
                          {order.paymentStatus || 'pending'}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${getOrderStatusBadge(order.orderStatus)}`}>
                          {order.orderStatus || 'pending'}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {formatDate(order.created)}
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn-admin btn-sm btn-primary btn-icon"
                            onClick={() => viewOrderDetails(order)}
                            title="View Details"
                          >
                            <i className="fa fa-eye" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="admin-pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      className={currentPage === pageNum ? 'active' : ''}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="admin-modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2>Order Details</h2>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              {/* Order Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#6b7280' }}>Order Info</h4>
                  <p style={{ margin: '0 0 5px' }}><strong>ID:</strong> {selectedOrder._id}</p>
                  <p style={{ margin: '0 0 5px' }}><strong>Date:</strong> {formatDate(selectedOrder.created)}</p>
                  <p style={{ margin: '0 0 5px' }}>
                    <strong>Payment:</strong>{' '}
                    <span className={`status-badge ${getPaymentStatusBadge(selectedOrder.paymentStatus)}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </p>
                  <p style={{ margin: '0 0 5px' }}>
                    <strong>Status:</strong>{' '}
                    <span className={`status-badge ${getOrderStatusBadge(selectedOrder.orderStatus)}`}>
                      {selectedOrder.orderStatus}
                    </span>
                  </p>
                  {selectedOrder.paymentMethod && (
                    <p style={{ margin: '0 0 5px' }}><strong>Method:</strong> {selectedOrder.paymentMethod}</p>
                  )}
                </div>
                <div>
                  <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#6b7280' }}>Amount</h4>
                  <p style={{ margin: '0 0 5px' }}><strong>Subtotal:</strong> {formatCurrency(selectedOrder.total)}</p>
                  <p style={{ margin: '0 0 5px' }}><strong>Tax:</strong> {formatCurrency(selectedOrder.totalTax)}</p>
                  <p style={{ margin: '0 0 5px', fontSize: '18px' }}>
                    <strong>Total:</strong> {formatCurrency(selectedOrder.totalWithTax || selectedOrder.total)}
                  </p>
                </div>
              </div>

              {/* Dedication Info */}
              {(selectedOrder.obituaryName || selectedOrder.dedicationMessage) && (
                <div style={{ background: '#f3f4f6', padding: '15px', marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#6b7280' }}>Dedication</h4>
                  {selectedOrder.obituaryName && (
                    <p style={{ margin: '0 0 5px' }}><strong>In Memory of:</strong> {selectedOrder.obituaryName}</p>
                  )}
                  {selectedOrder.dedicationMessage && (
                    <p style={{ margin: 0 }}><strong>Message:</strong> {selectedOrder.dedicationMessage}</p>
                  )}
                </div>
              )}

              {/* Billing Details */}
              {selectedOrder.billingDetails && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#6b7280' }}>Billing Details</h4>
                  <p style={{ margin: '0 0 5px' }}><strong>Name:</strong> {selectedOrder.billingDetails.name}</p>
                  <p style={{ margin: '0 0 5px' }}><strong>Email:</strong> {selectedOrder.billingDetails.email}</p>
                  {selectedOrder.billingDetails.phone && (
                    <p style={{ margin: '0 0 5px' }}><strong>Phone:</strong> {selectedOrder.billingDetails.phone}</p>
                  )}
                  {selectedOrder.billingDetails.address && (
                    <p style={{ margin: 0 }}>
                      <strong>Address:</strong>{' '}
                      {[
                        selectedOrder.billingDetails.address.line1,
                        selectedOrder.billingDetails.address.line2,
                        selectedOrder.billingDetails.address.city,
                        selectedOrder.billingDetails.address.state,
                        selectedOrder.billingDetails.address.postal_code,
                        selectedOrder.billingDetails.address.country
                      ].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
              )}

              {/* Shipping Details */}
              {selectedOrder.shippingDetails?.address && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#6b7280' }}>Shipping Details</h4>
                  <p style={{ margin: '0 0 5px' }}><strong>Name:</strong> {selectedOrder.shippingDetails.name}</p>
                  {selectedOrder.shippingDetails.phone && (
                    <p style={{ margin: '0 0 5px' }}><strong>Phone:</strong> {selectedOrder.shippingDetails.phone}</p>
                  )}
                  <p style={{ margin: 0 }}>
                    <strong>Address:</strong>{' '}
                    {[
                      selectedOrder.shippingDetails.address.line1,
                      selectedOrder.shippingDetails.address.line2,
                      selectedOrder.shippingDetails.address.city,
                      selectedOrder.shippingDetails.address.state,
                      selectedOrder.shippingDetails.address.postal_code,
                      selectedOrder.shippingDetails.address.country
                    ].filter(Boolean).join(', ')}
                  </p>
                </div>
              )}

              {/* Order Notes */}
              {selectedOrder.orderNotes && (
                <div>
                  <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#6b7280' }}>Notes</h4>
                  <p style={{ margin: 0, background: '#f3f4f6', padding: '10px' }}>
                    {selectedOrder.orderNotes}
                  </p>
                </div>
              )}

              {/* Stripe Reference */}
              {selectedOrder.stripePaymentIntentId && (
                <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e5e7eb' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                    <strong>Stripe Payment Intent:</strong>{' '}
                    <code style={{ background: '#f3f4f6', padding: '2px 6px' }}>
                      {selectedOrder.stripePaymentIntentId}
                    </code>
                  </p>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-admin btn-secondary" onClick={() => setShowDetailModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersAdmin;
