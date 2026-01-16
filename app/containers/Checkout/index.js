/**
 * Checkout Page Container
 */
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Container, Row, Col, Card, CardBody, Alert } from 'reactstrap';
import { useHistory } from 'react-router-dom';

// Import the specialized OrderSummary component
import OrderSummary from '../../components/Store/Checkout/OrderSummary';
import CheckoutForm from './CheckoutForm';
import { handleRemoveFromCart } from '../Cart/actions'; // Import remove action

const CheckoutPage = (props) => {
  const { cartItems, cartTotal, handleRemoveFromCart } = props;
  const [error, setError] = useState('');
  const history = useHistory();

  // Redirect if cart is empty
  if (!cartItems || cartItems.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg="6">
            <Alert color="warning" className="text-center">
              <h4>Your cart is empty</h4>
              <p>Add some items to your cart before checking out.</p>
              <button
                className="btn btn-primary mt-3"
                onClick={() => history.push('/shop')}
              >
                Continue Shopping
              </button>
            </Alert>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="checkout-page py-5">
      <Row>
        {/* Left Column: Checkout Form */}
        <Col lg="7" className="mb-4">
          <Card className="shadow-sm border-0">
            <CardBody className="p-4">
              <div className="mb-4">
                <h2 className="h4 mb-2">Secure Checkout</h2>
                <p className="text-muted small">Complete your purchase securely below</p>
              </div>

              {error && <Alert color="danger" className="mb-4">{error}</Alert>}

              <CheckoutForm
                cartItems={cartItems}
                cartTotal={cartTotal}
                setError={setError}
              />
            </CardBody>
          </Card>
        </Col>

        {/* Right Column: Order Summary with Remove Feature */}
        <Col lg="5">
          <OrderSummary 
            cartItems={cartItems} 
            cartTotal={cartTotal} 
            handleRemoveFromCart={handleRemoveFromCart}
          />
          
          <div className="text-center mt-4 text-muted extra-small">
            <p className="mb-1">🔒 Secure SSL Encryption • ✓ PCI Compliant</p>
            <p>💳 Powered by Stripe</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state) => ({
  cartItems: state.cart?.cartItems || [],
  cartTotal: state.cart?.cartTotal || 0,
});

// Connect handleRemoveFromCart action
export default connect(mapStateToProps, { handleRemoveFromCart })(CheckoutPage);