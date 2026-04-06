/**
 * Order Confirmation Page
 * Shows after successful payment — with obituary tribute section
 */

import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import { Heart, TreePine } from 'lucide-react';
import './OrderConfirmation.css';
import LoadingIndicator from '../../Common/LoadingIndicator';
import Button from '../../Common/Button';
import { API_URL } from '../../constants';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order,          setOrder]          = useState(null);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');
  const [obituaryData,   setObituaryData]   = useState(null);

  useEffect(() => {
    fetchOrderDetails();

    // Try to load obituary from sessionStorage
    const obituaryId = sessionStorage.getItem('memorial_obituaryId');
    if (obituaryId) {
      fetchObituary(obituaryId);
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/order/${orderId}`, {
        headers: { Authorization: localStorage.getItem('token') || '' }
      });
      setOrder(response.data.order);
    } catch (err) {
      setError('Could not load order details');
    } finally {
      setLoading(false);
    }
  };

  const fetchObituary = async (id) => {
    try {
      const res = await fetch(`${API_URL}/obituaries/${id}`);
      if (res.ok) {
        const data = await res.json();
        setObituaryData(data);
      }
    } catch (_) {}
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric'
      });
    } catch { return ''; }
  };

  if (loading) {
    return (
      <Container className='text-center' style={{ padding: '100px 0' }}>
        <LoadingIndicator />
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container className='text-center' style={{ padding: '100px 0' }}>
        <h3>Order not found</h3>
        <p>{error}</p>
        <Link to='/shop'><Button variant='primary' text='Continue Shopping' /></Link>
      </Container>
    );
  }

  // Obituary info
  const firstName = obituaryData?.firstName || '';
  const lastName  = obituaryData?.lastName  || '';
  const fullName  = `${firstName} ${lastName}`.trim();
  const photo     = obituaryData?.primaryPhoto || obituaryData?.photos?.[0] || null;
  const birthDate = formatDate(obituaryData?.birthDate);
  const deathDate = formatDate(obituaryData?.deathDate);

  return (
    <div className='order-confirmation-page'>

      {/* ── Obituary Tribute Thank You ─────────────────────────── */}
      {obituaryData && (
        <div className='tribute-thank-you-banner'>
          <div className='tribute-thank-you-overlay' />
          <div className='tribute-thank-you-content'>

            {/* Circular photo in golden ring */}
            <div className='tribute-photo-ring'>
              <img
                className='tribute-photo'
                src={photo || 'https://via.placeholder.com/160x160?text=Photo'}
                alt={fullName}
                onError={e => { e.target.src = 'https://via.placeholder.com/160x160?text=Photo'; }}
              />
            </div>

            <div className='tribute-thank-you-badge'>
              <Heart size={13} />
              <span>Love Sent</span>
            </div>

            <h2 className='tribute-thank-you-headline'>
              Your love has been sent<br />
              <span className='tribute-name-highlight'>In memory of {fullName}</span>
            </h2>

            {(birthDate || deathDate) && (
              <p className='tribute-dates'>
                {birthDate}{birthDate && deathDate ? ' — ' : ''}{deathDate}
              </p>
            )}

            <p className='tribute-thank-you-message'>
              Thank you for this beautiful act of love. Every gesture of remembrance
              keeps a soul alive in our hearts. Your kindness honors their legacy
              and brings comfort to those who miss them most.
            </p>

            <div className='tribute-divider'>
              <TreePine size={16} className='tribute-divider-icon' />
            </div>

            <p className='tribute-sub-message'>
              "What we have once enjoyed, we can never lose.
              All that we love deeply becomes a part of us."
            </p>
          </div>
        </div>
      )}

      {/* ── Order Details ──────────────────────────────────────── */}
      <Container>
        <div className='confirmation-header'>
          <div className='confirm-check-icon'>
            <Heart size={36} strokeWidth={2} />
          </div>
          <h1>Order Confirmed</h1>
          <p className='lead'>
            Your order has been placed successfully. We appreciate your support.
          </p>
          <p className='order-id'>Order ID: #{order._id}</p>
        </div>

        <Row className='mt-4'>
          <Col lg='8' className='mx-auto'>
            <div className='order-details-card'>
              <h3>Order Details</h3>

              <div className='detail-section'>
                <h5>Order Information</h5>
                <div className='info-row'>
                  <span>Order Date:</span>
                  <span>{new Date(order.created).toLocaleDateString()}</span>
                </div>
                <div className='info-row'>
                  <span>Payment Status:</span>
                  <span className='badge badge-success'>{order.paymentStatus}</span>
                </div>
                <div className='info-row'>
                  <span>Order Status:</span>
                  <span className='badge badge-info'>{order.orderStatus}</span>
                </div>
              </div>

              <div className='detail-section'>
                <h5>Items Ordered</h5>
                {order.cart.products.map((item, index) => (
                  <div key={index} className='order-item'>
                    <img
                      src={item.product.imageUrl || '/images/placeholder-image.png'}
                      alt={item.product.name}
                      className='item-thumbnail'
                    />
                    <div className='item-info'>
                      <p className='item-name'>{item.product.name}</p>
                      <p className='item-quantity'>Quantity: {item.quantity}</p>
                    </div>
                    <div className='item-price'>${item.totalPrice.toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className='detail-section'>
                <h5>Order Summary</h5>
                <div className='info-row'>
                  <span>Subtotal:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className='info-row'>
                  <span>Tax:</span>
                  <span>${order.totalTax.toFixed(2)}</span>
                </div>
                <div className='info-row'>
                  <span>Shipping:</span>
                  <span className='text-success'>FREE</span>
                </div>
                <div className='info-row total-row'>
                  <span>Total:</span>
                  <span>${order.totalWithTax.toFixed(2)}</span>
                </div>
              </div>

              <div className='detail-section'>
                <Row>
                  <Col md='6'>
                    <h5>Billing Address</h5>
                    <address>
                      {order.billingDetails.name}<br />
                      {order.billingDetails.address.line1}<br />
                      {order.billingDetails.address.line2 &&
                        `${order.billingDetails.address.line2}`}
                      {order.billingDetails.address.city},{' '}
                      {order.billingDetails.address.state}{' '}
                      {order.billingDetails.address.postal_code}<br />
                      {order.billingDetails.address.country}
                    </address>
                  </Col>
                  <Col md='6'>
                    <h5>Shipping Address</h5>
                    <address>
                      {order.shippingDetails.name}<br />
                      {order.shippingDetails.address.line1}<br />
                      {order.shippingDetails.address.city},{' '}
                      {order.shippingDetails.address.state}{' '}
                      {order.shippingDetails.address.postal_code}<br />
                      {order.shippingDetails.address.country}
                    </address>
                  </Col>
                </Row>
              </div>

              <div className='email-notice'>
                A confirmation email has been sent to{' '}
                <strong>{order.billingDetails.email}</strong>
              </div>

              <div className='action-buttons'>
                <Link to='/shop'>
                  <Button variant='primary' text='Continue Shopping' />
                </Link>
                <Link to='/dashboard/orders'>
                  <Button variant='outline' text='View My Orders' />
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default OrderConfirmation;
