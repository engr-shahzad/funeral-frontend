/**
 *
 * Checkout Page - Secure Memorial Tribute Checkout
 * Matches West River Funeral Directors design
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import './CheckoutPage.css';

import actions from '../../actions';

class CheckoutPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      // Card details (Stripe only)
      cardNumber: '',
      cvv: '',
      expiration: '',
      
      // Contact info
      email: '',
      phone: '',
      
      // Billing address
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      state: '',
      zipcode: '',
      
      // Form state
      errors: {},
      isProcessing: false,
      agreedToTerms: false
    };
  }

  handleInputChange = (field, value) => {
    this.setState({ 
      [field]: value,
      errors: { ...this.state.errors, [field]: '' }
    });
  }

  validateForm = () => {
    const errors = {};
    const { 
      cardNumber, cvv, expiration,
      email, phone, firstName, lastName, 
      street, city, state, zipcode 
    } = this.state;

    // Email validation
    if (!email || !email.includes('@')) {
      errors.email = 'Valid email is required';
    }

    // Phone validation
    if (!phone || phone.length < 10) {
      errors.phone = 'Valid phone number is required';
    }

    // Card validation (Stripe only)
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15) {
      errors.cardNumber = 'Valid card number is required';
    }
    if (!cvv || cvv.length < 3) {
      errors.cvv = 'Valid CVV is required';
    }
    if (!expiration || !expiration.match(/\d{2}\/\d{2}/)) {
      errors.expiration = 'Valid expiration date is required (MM/YY)';
    }

    // Billing address validation
    if (!firstName) errors.firstName = 'First name is required';
    if (!lastName) errors.lastName = 'Last name is required';
    if (!street) errors.street = 'Street address is required';
    if (!city) errors.city = 'City is required';
    if (!state) errors.state = 'State is required';
    if (!zipcode || zipcode.length < 5) errors.zipcode = 'Valid ZIP code is required';

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    if (!this.validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.setState({ isProcessing: true });

    const { cartItems, cartTotal, user } = this.props;
    const { 
      cardNumber, cvv, expiration,
      email, phone, firstName, lastName,
      street, city, state, zipcode
    } = this.state;

    const orderData = {
      // Order details
      cartItems,
      total: cartTotal,
      
      // Payment info (Stripe only)
      paymentMethod: 'stripe',
      cardLast4: cardNumber.slice(-4),
      cardBrand: this.detectCardBrand(cardNumber),
      
      // Customer info
      customer: {
        email,
        phone,
        userId: user?._id
      },
      
      // Billing address
      billingAddress: {
        firstName,
        lastName,
        street,
        city,
        state,
        zipcode
      },
      
      // Metadata
      metadata: {
        obituaryId: cartItems[0]?.obituaryId,
        tributeName: cartItems[0]?.tributeName
      }
    };

    try {
      // Call your place order action
      await this.props.placeOrder(orderData);
      
      // Success - redirect to success page
      // this.props.history.push('/order/success');
      
    } catch (error) {
      console.error('Order placement failed:', error);
      this.setState({ 
        errors: { submit: error.message || 'Order placement failed. Please try again.' },
        isProcessing: false 
      });
    }
  }

  detectCardBrand = (number) => {
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.startsWith('4')) return 'Visa';
    if (cleaned.startsWith('5')) return 'Mastercard';
    if (cleaned.startsWith('3')) return 'Amex';
    if (cleaned.startsWith('6')) return 'Discover';
    return 'Unknown';
  }

  formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substr(0, 19);
  }

  formatExpiration = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substr(0, 2) + '/' + cleaned.substr(2, 2);
    }
    return cleaned;
  }

  render() {
    const { cartItems, cartTotal, authenticated, obituary } = this.props;
    const { 
      cardNumber, cvv, expiration,
      email, phone, firstName, lastName,
      street, city, state, zipcode,
      errors, isProcessing
    } = this.state;

    // Redirect if cart is empty
    if (!cartItems || cartItems.length === 0) {
      return <Redirect to="/shop" />;
    }

    // Calculate order summary
    const subtotal = cartTotal;
    const serviceFee = 7.95;
    const tax = 0.00;
    const total = subtotal + serviceFee + tax;

    return (
      <div className='checkout-page-memorial'>
        <Container>
          {/* Memorial Header */}
          {/* <div className='checkout-memorial-header'>
            <div className='memorial-profile-photo'>
              <img 
                src={obituary?.photo || '/images/profile-placeholder.jpg'} 
                alt='Memorial' 
              />
            </div>
            <p className='memorial-subtitle'>In loving memory</p>
            <h1 className='memorial-name'>
              {obituary?.name || 'Vickie Jean Brown'}
            </h1>
          </div> */}

          <Row className='checkout-content-row'>
            {/* Left Column - Payment Form */}
            <Col lg='7' md='12' className='payment-column'>
              <div className='payment-section-wrapper'>
                {/* Share Condolences */}
                <div className='share-condolences-section'>
                  <h3>Share Condolences (optional)</h3>
                  <p className='condolence-link'>
                    Post on {obituary?.name || 'Vickie Jean Brown'}'s Tribute Wall
                  </p>
                </div>

                {/* Payment Information */}
                <div className='payment-info-section'>
                  <h3>Payment Information</h3>
                  <p className='payment-subtitle'>
                    Enter your card details below. All transactions are secure and encrypted.
                  </p>

                  {/* Stripe Card Form */}
                  <div className='stripe-card-form'>
                    <Row>
                      <Col md='12'>
                        <div className='form-group'>
                          <label>Credit or Debit Card Number</label>
                          <input
                            type='text'
                            className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                            placeholder='1234 1234 1234 1234'
                            value={cardNumber}
                            onChange={(e) => 
                              this.handleInputChange('cardNumber', this.formatCardNumber(e.target.value))
                            }
                            maxLength='19'
                          />
                          {errors.cardNumber && <span className='error-text'>{errors.cardNumber}</span>}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md='6'>
                        <div className='form-group'>
                          <label>CV Code</label>
                          <input
                            type='text'
                            className={`form-control ${errors.cvv ? 'is-invalid' : ''}`}
                            placeholder='CVC'
                            value={cvv}
                            onChange={(e) => 
                              this.handleInputChange('cvv', e.target.value.replace(/\D/g, '').substr(0, 4))
                            }
                            maxLength='4'
                          />
                          {errors.cvv && <span className='error-text'>{errors.cvv}</span>}
                        </div>
                      </Col>
                      <Col md='6'>
                        <div className='form-group'>
                          <label>Expiration</label>
                          <input
                            type='text'
                            className={`form-control ${errors.expiration ? 'is-invalid' : ''}`}
                            placeholder='MM/YY'
                            value={expiration}
                            onChange={(e) => 
                              this.handleInputChange('expiration', this.formatExpiration(e.target.value))
                            }
                            maxLength='5'
                          />
                          {errors.expiration && <span className='error-text'>{errors.expiration}</span>}
                        </div>
                      </Col>
                    </Row>

                    {/* Accepted Cards */}
                    <div className='accepted-cards'>
                      <span className='cards-label'>We accept:</span>
                      <div className='card-icons'>
                        <span className='card-icon'>💳 Visa</span>
                        <span className='card-icon'>💳 Mastercard</span>
                        <span className='card-icon'>💳 Amex</span>
                        <span className='card-icon'>💳 Discover</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className='contact-info-section'>
                  <Row>
                    <Col md='6'>
                      <div className='form-group'>
                        <label>Your email</label>
                        <input
                          type='email'
                          className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                          value={email}
                          onChange={(e) => this.handleInputChange('email', e.target.value)}
                        />
                        <small className='form-text'>
                          We ask for your email in order to send you a receipt
                        </small>
                        {errors.email && <span className='error-text'>{errors.email}</span>}
                      </div>
                    </Col>
                    <Col md='6'>
                      <div className='form-group'>
                        <label>Your telephone</label>
                        <input
                          type='tel'
                          className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                          value={phone}
                          onChange={(e) => this.handleInputChange('phone', e.target.value.replace(/\D/g, ''))}
                          maxLength='15'
                        />
                        <small className='form-text'>
                          We ask for your phone in case we have a question about your order
                        </small>
                        {errors.phone && <span className='error-text'>{errors.phone}</span>}
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Billing Address */}
                <div className='billing-address-section'>
                  <Row>
                    <Col md='6'>
                      <div className='form-group'>
                        <label>First Name</label>
                        <input
                          type='text'
                          className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                          value={firstName}
                          onChange={(e) => this.handleInputChange('firstName', e.target.value)}
                        />
                        {errors.firstName && <span className='error-text'>{errors.firstName}</span>}
                      </div>
                    </Col>
                    <Col md='6'>
                      <div className='form-group'>
                        <label>Last Name</label>
                        <input
                          type='text'
                          className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                          value={lastName}
                          onChange={(e) => this.handleInputChange('lastName', e.target.value)}
                        />
                        {errors.lastName && <span className='error-text'>{errors.lastName}</span>}
                      </div>
                    </Col>
                  </Row>

                  <div className='form-group'>
                    <label>Street</label>
                    <input
                      type='text'
                      className={`form-control ${errors.street ? 'is-invalid' : ''}`}
                      value={street}
                      onChange={(e) => this.handleInputChange('street', e.target.value)}
                    />
                    {errors.street && <span className='error-text'>{errors.street}</span>}
                  </div>

                  <Row>
                    <Col md='4'>
                      <div className='form-group'>
                        <label>City</label>
                        <input
                          type='text'
                          className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                          value={city}
                          onChange={(e) => this.handleInputChange('city', e.target.value)}
                        />
                        {errors.city && <span className='error-text'>{errors.city}</span>}
                      </div>
                    </Col>
                    <Col md='4'>
                      <div className='form-group'>
                        <label>State/Province</label>
                        <select
                          className={`form-control ${errors.state ? 'is-invalid' : ''}`}
                          value={state}
                          onChange={(e) => this.handleInputChange('state', e.target.value)}
                        >
                          <option value=''>Select state</option>
                          <option value='AL'>Alabama</option>
                          <option value='AK'>Alaska</option>
                          <option value='AZ'>Arizona</option>
                          {/* Add all states */}
                        </select>
                        {errors.state && <span className='error-text'>{errors.state}</span>}
                      </div>
                    </Col>
                    <Col md='4'>
                      <div className='form-group'>
                        <label>ZIP/Postcode</label>
                        <input
                          type='text'
                          className={`form-control ${errors.zipcode ? 'is-invalid' : ''}`}
                          value={zipcode}
                          onChange={(e) => this.handleInputChange('zipcode', e.target.value.replace(/\D/g, '').substr(0, 10))}
                        />
                        {errors.zipcode && <span className='error-text'>{errors.zipcode}</span>}
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Review Order Button */}
                <div className='review-order-section'>
                  {errors.submit && (
                    <div className='alert alert-danger'>{errors.submit}</div>
                  )}
                  <button
                    className='review-order-btn'
                    onClick={this.handleSubmit}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Review Order'}
                  </button>
                </div>

                {/* Review & Place Order Link */}
                <div className='place-order-link'>
                  <a href='#review'>Review & Place Order</a>
                </div>
              </div>
            </Col>

            {/* Right Column - Order Summary */}
            <Col lg='5' md='12' className='summary-column'>
              <div className='order-summary-card'>
                {/* Product */}
                {cartItems.map((item, index) => (
                  <div key={index} className='summary-product-item'>
                    <img 
                      src={item.imageUrl || item.images?.[0]?.url || '/images/tree-icon.png'} 
                      alt={item.name} 
                      className='product-thumbnail'
                    />
                    <div className='product-details'>
                      <h4>{item.name}</h4>
                      <span className='product-price'>${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}

                {/* Order Breakdown */}
                <div className='order-breakdown'>
                  <div className='breakdown-row'>
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className='breakdown-row'>
                    <span>Standard Service</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className='breakdown-row'>
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className='breakdown-row total-row'>
                    <strong>Total</strong>
                    <strong>${total.toFixed(2)}</strong>
                  </div>
                </div>

                {/* Security Badge */}
                <div className='security-guarantee'>
                  <div className='security-icon'>🔒</div>
                  <div className='security-text'>
                    <strong>Guaranteed Safe Shopping</strong>
                    <p>
                      If unauthorized charges are made to your credit card as a 
                      result of shopping at our store, you will be reimbursed. 
                      Shopping is encrypted and transmitted without any risk using 
                      a Secure Sockets Layer (SSL) protocol. Your credit card details 
                      are never stored on our system.
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    cartItems: state.cart.cartItems,
    cartTotal: state.cart.cartTotal,
    authenticated: state.authentication.authenticated,
    user: state.account.user,
    obituary: state.obituary?.currentObituary
  };
};

export default connect(mapStateToProps, actions)(CheckoutPage);