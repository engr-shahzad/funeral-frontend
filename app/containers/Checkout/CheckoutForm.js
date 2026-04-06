/**
 * CHECKOUT FORM — Multi-step wizard, SSR-safe
 *
 * Steps:
 *   1. Contact Information (name, email, phone)
 *   2. Billing Address
 *   3. Memorial Dedication  ← only shown when obituaryId present
 *   3/4. Payment (card details + pay)
 *
 * SSR notes:
 *   - stripePromise initialised lazily (browser only)
 *   - localStorage / sessionStorage guarded with isBrowser
 *   - Stripe Elements mounted only after client hydration
 */

import React, { useState, useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FormGroup, Input, Row, Col } from 'reactstrap';
import { success } from 'react-notification-system-redux';
import { clearCart } from '../Cart/actions';
import { API_URL } from '../../constants';

// ── SSR guard ─────────────────────────────────────────────────────────────────
const isBrowser = typeof window !== 'undefined';

// ── Lazy Stripe init (runtime key fetch) ──────────────────────────────────────
// Fetches the publishable key from the backend so the bundle never needs it
// baked in at build time — fixes card elements missing on production.
let _stripePromise = null;
const getStripePromise = () => {
    if (!isBrowser) return null;
    if (!_stripePromise) {
        const { loadStripe } = require('@stripe/stripe-js');
        _stripePromise = fetch(`${API_URL}/config/stripe`)
            .then(res => {
                if (!res.ok) throw new Error('config fetch failed');
                return res.json();
            })
            .then(data => loadStripe(data.publishableKey))
            .catch(() => {
                // Fallback: use key baked at build time (works for localhost dev)
                const baked = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY;
                return baked ? loadStripe(baked) : null;
            });
    }
    return _stripePromise;
};

// ── Safe storage helpers ───────────────────────────────────────────────────────
const storage = {
    get:    (k)    => isBrowser ? localStorage.getItem(k)    : null,
    set:    (k, v) => isBrowser && localStorage.setItem(k, v),
    remove: (k)    => isBrowser && localStorage.removeItem(k)
};
const session = {
    get:    (k)    => isBrowser ? sessionStorage.getItem(k)  : null,
    remove: (k)    => isBrowser && sessionStorage.removeItem(k)
};

// ── Stripe element style ───────────────────────────────────────────────────────
const stripeElementStyle = {
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Inter","Helvetica Neue",Helvetica,sans-serif',
            fontSize: '15px',
            fontSmoothing: 'antialiased',
            '::placeholder': { color: '#a0aec0' }
        },
        invalid: { color: '#e53e3e', iconColor: '#e53e3e' }
    }
};

const CARD_BRANDS = {
    visa:       { label: 'Visa',       color: '#1a1f71' },
    mastercard: { label: 'Mastercard', color: '#eb001b' },
    amex:       { label: 'Amex',       color: '#2E77BC' },
    discover:   { label: 'Discover',   color: '#FF6600' },
    jcb:        { label: 'JCB',        color: '#003087' },
    diners:     { label: 'Diners',     color: '#004B87' },
    unionpay:   { label: 'UnionPay',   color: '#D3272D' },
    unknown:    { label: '',           color: '#a0a0a0' }
};

// ─────────────────────────────────────────────────────────────────────────────
// SMALL UI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const FieldLabel = ({ children }) => (
    <label style={{
        display: 'block', fontSize: '11.5px', fontWeight: '700',
        color: '#4a5568', marginBottom: '6px',
        textTransform: 'uppercase', letterSpacing: '0.07em'
    }}>
        {children}
    </label>
);

const TextField = ({ label, required, error, ...inputProps }) => (
    <FormGroup style={{ marginBottom: '14px' }}>
        <FieldLabel>{label}{required && ' *'}</FieldLabel>
        <Input
            {...inputProps}
            required={required}
            style={{
                border: `1.5px solid ${error ? '#e53e3e' : '#e2e8f0'}`,
                borderRadius: '8px', padding: '10px 14px',
                fontSize: '15px', color: '#32325d',
                boxShadow: 'none', height: 'auto'
            }}
        />
        {error && <p style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', marginBottom: 0 }}>{error}</p>}
    </FormGroup>
);

const StripeField = ({ label, error, children }) => (
    <div style={{ marginBottom: '14px' }}>
        <FieldLabel>{label}</FieldLabel>
        <div style={{
            padding: '11px 14px',
            border: `1.5px solid ${error ? '#e53e3e' : '#e2e8f0'}`,
            borderRadius: '8px', background: '#fff'
        }}>
            {children}
        </div>
        {error && <p style={{ color: '#e53e3e', fontSize: '12px', marginTop: '4px', marginBottom: 0 }}>{error}</p>}
    </div>
);

// ── Step progress indicator ────────────────────────────────────────────────────
const StepBar = ({ steps, current }) => (
    <div style={{
        display: 'flex', alignItems: 'center',
        marginBottom: '28px', padding: '0 4px'
    }}>
        {steps.map((s, i) => {
            const done   = current > s.id;
            const active = current === s.id;
            return (
                <React.Fragment key={s.id}>
                    {/* Circle */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        <div style={{
                            width: '34px', height: '34px', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: '700', fontSize: '13px',
                            border: `2px solid ${done || active ? '#2d6a4f' : '#cbd5e0'}`,
                            background: done ? '#2d6a4f' : active ? '#f0fdf4' : '#f7fafc',
                            color:      done ? '#fff'    : active ? '#2d6a4f' : '#a0aec0',
                            transition: 'all 0.3s'
                        }}>
                            {done
                                ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                : s.id
                            }
                        </div>
                        <span style={{
                            fontSize: '11px', fontWeight: done || active ? '600' : '400',
                            color: done || active ? '#2d6a4f' : '#a0aec0',
                            whiteSpace: 'nowrap', letterSpacing: '0.02em'
                        }}>
                            {s.label}
                        </span>
                    </div>

                    {/* Connector line */}
                    {i < steps.length - 1 && (
                        <div style={{
                            flex: 1, height: '2px', margin: '0 6px', marginBottom: '20px',
                            background: current > s.id ? '#2d6a4f' : '#e2e8f0',
                            transition: 'background 0.3s'
                        }} />
                    )}
                </React.Fragment>
            );
        })}
    </div>
);

// ── Nav buttons ────────────────────────────────────────────────────────────────
const NavButtons = ({ onBack, onNext, nextLabel = 'Continue', isFirst, isProcessing, disabled }) => (
    <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
        {!isFirst && (
            <button
                type="button"
                onClick={onBack}
                style={{
                    flex: '0 0 auto', padding: '12px 24px',
                    border: '1.5px solid #e2e8f0', borderRadius: '9px',
                    background: '#fff', color: '#4a5568',
                    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '6px'
                }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                Back
            </button>
        )}
        <button
            type={onNext ? 'button' : 'submit'}
            onClick={onNext}
            disabled={isProcessing || disabled}
            style={{
                flex: 1, padding: '13px 24px',
                background: isProcessing ? '#68d391' : '#2d6a4f',
                color: '#fff', border: 'none', borderRadius: '9px',
                fontSize: '15px', fontWeight: '700',
                cursor: isProcessing || disabled ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', letterSpacing: '0.02em', transition: 'background 0.2s'
            }}
        >
            {isProcessing ? (
                <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                    </svg>
                    Processing...
                </>
            ) : (
                <>
                    {nextLabel}
                    {onNext && <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>}
                </>
            )}
        </button>
    </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAYMENT FORM (client-only)
// ─────────────────────────────────────────────────────────────────────────────
const PaymentForm = (props) => {
    const { cartItems, cartTotal, user, setError, clearCart: clearCartAction, showSuccessNotification } = props;

    const { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } =
        require('@stripe/react-stripe-js');

    const stripe    = useStripe();
    const elements  = useElements();
    const history   = useHistory();
    const isMounted = useRef(true);

    // ── Form state ──────────────────────────────────────────────────────────
    const [billing, setBilling] = useState({
        name:    user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
        email:   user?.email || '',
        phone:   '',
        address: { line1: '', line2: '', city: '', state: '', postal_code: '', country: 'US' }
    });
    const [fieldErrs,    setFieldErrs]    = useState({});
    const [cardErrors,   setCardErrors]   = useState({ cardNumber: '', cardExpiry: '', cardCvc: '' });
    const [cardBrand,    setCardBrand]    = useState('unknown');
    const [isProcessing, setIsProcessing] = useState(false);

    const [memorialObituaryId] = useState(() => session.get('memorial_obituaryId'));
    const [dedication, setDedication]     = useState('');

    // ── Steps definition ────────────────────────────────────────────────────
    const steps = [
        { id: 1, label: 'Contact'  },
        { id: 2, label: 'Address'  },
        ...(memorialObituaryId ? [{ id: 3, label: 'Dedication' }] : []),
        { id: memorialObituaryId ? 4 : 3, label: 'Payment' }
    ];
    const PAYMENT_STEP = memorialObituaryId ? 4 : 3;

    const [currentStep, setCurrentStep] = useState(1);

    useEffect(() => { return () => { isMounted.current = false; }; }, []);

    // ── Field helpers ───────────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFieldErrs(prev => ({ ...prev, [name]: '' }));
        if (name.includes('.')) {
            const [p, c] = name.split('.');
            setBilling(prev => ({ ...prev, [p]: { ...prev[p], [c]: value } }));
        } else {
            setBilling(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleStripeChange = (field) => (e) => {
        setCardErrors(prev => ({ ...prev, [field]: e.error ? e.error.message : '' }));
        if (field === 'cardNumber' && e.brand) setCardBrand(e.brand);
    };

    // ── Step validation ─────────────────────────────────────────────────────
    const validateStep = (step) => {
        const errs = {};
        if (step === 1) {
            if (!billing.name.trim())  errs.name  = 'Full name is required';
            if (!billing.email.trim()) errs.email = 'Email is required';
            if (!billing.phone.trim()) errs.phone = 'Phone number is required';
        }
        if (step === 2) {
            if (!billing.address.line1.trim())       errs['address.line1']       = 'Street address is required';
            if (!billing.address.city.trim())        errs['address.city']        = 'City is required';
            if (!billing.address.state.trim())       errs['address.state']       = 'State is required';
            if (!billing.address.postal_code.trim()) errs['address.postal_code'] = 'ZIP code is required';
        }
        setFieldErrs(errs);
        return Object.keys(errs).length === 0;
    };

    const goNext = () => {
        if (!validateStep(currentStep)) return;
        setCurrentStep(s => s + 1);
    };

    const goBack = () => {
        setFieldErrs({});
        setCurrentStep(s => s - 1);
    };

    // ── Auth header ─────────────────────────────────────────────────────────
    const getAuthHeaders = () => {
        const t = storage.get('token') || storage.get('authToken') || storage.get('access_token');
        if (!t) return {};
        return { Authorization: t.startsWith('Bearer ') ? t : `Bearer ${t}` };
    };

    // ── Payment submit ──────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        setError('');
        setCardErrors({ cardNumber: '', cardExpiry: '', cardCvc: '' });

        const cardEl         = elements.getElement(CardNumberElement);
        const storedCartId   = storage.get('cart_id');
        const reqHeaders     = { 'Content-Type': 'application/json', ...getAuthHeaders() };

        try {
            const { default: axios } = await import('axios');

            // 1. Create payment intent
            const intentRes = await axios.post(
                `${API_URL}/order/stripe/create-payment-intent`,
                {
                    cartId: storedCartId || null, amount: cartTotal, currency: 'usd',
                    products: cartItems.map(item => ({
                        product: item._id || item.id, quantity: item.quantity,
                        price: item.price, taxable: item.taxable !== false
                    })),
                    billingDetails: billing
                },
                { headers: reqHeaders }
            );

            const { clientSecret, orderId, cartId: returnedCartId } = intentRes.data;
            if (!clientSecret) throw new Error('Could not initialize payment. Please try again.');
            if (returnedCartId) storage.set('cart_id', returnedCartId);

            // 2. Confirm card (inline, no redirect)
            const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardEl,
                    billing_details: {
                        name: billing.name, email: billing.email,
                        phone: billing.phone, address: billing.address
                    }
                }
            });

            if (stripeErr) {
                setCardErrors(prev => ({ ...prev, cardNumber: stripeErr.message }));
                setError(stripeErr.message);
                setIsProcessing(false);
                return;
            }

            if (paymentIntent?.status === 'succeeded') {
                // 3. Confirm with our backend
                const confirmData = {
                    paymentIntentId: paymentIntent.id, orderId,
                    cartId: returnedCartId || storedCartId,
                    billingDetails: billing, shippingDetails: billing
                };
                if (memorialObituaryId) {
                    confirmData.obituaryId        = memorialObituaryId;
                    confirmData.dedicationMessage = dedication || null;
                    confirmData.customerName      = billing.name;
                    confirmData.customerEmail     = billing.email;
                }

                let confirmedOrderId = orderId;
                try {
                    const confirmRes = await axios.post(
                        `${API_URL}/order/stripe/confirm-payment`, confirmData, { headers: reqHeaders }
                    );
                    confirmedOrderId = confirmRes.data?.order?._id || orderId;
                } catch (err) {
                    console.warn('Backend confirm warning:', err.message);
                }

                session.remove('memorial_obituaryId');
                clearCartAction();
                storage.remove('cart_id');

                showSuccessNotification({
                    title: 'Order Placed Successfully!',
                    message: 'Check your email for confirmation.',
                    position: 'tr', autoDismiss: 3
                });

                setTimeout(() => {
                    if (isMounted.current)
                        history.push(confirmedOrderId ? `/order/success/${confirmedOrderId}` : '/order-success');
                }, 1000);
            }

        } catch (err) {
            console.error('Payment error:', err);
            setError(err.response?.data?.error || err.message || 'Payment failed. Please try again.');
            setIsProcessing(false);
        }
    };

    const brandInfo = CARD_BRANDS[cardBrand] || CARD_BRANDS.unknown;

    // ─────────────────────────────────────────────────────────────────────────
    // RENDER
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div style={{ fontFamily: '"Inter","Helvetica Neue",sans-serif' }}>
            {/* Step progress bar */}
            <StepBar steps={steps} current={currentStep} />

            {/* ── Step 1: Contact ───────────────────────────────────────── */}
            {currentStep === 1 && (
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        <h5 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: '700', color: '#1a202c' }}>
                            Contact Information
                        </h5>
                        <p style={{ margin: 0, fontSize: '13px', color: '#718096' }}>
                            We'll send your order confirmation here
                        </p>
                    </div>

                    <TextField
                        label="Full Name" type="text" name="name"
                        value={billing.name} onChange={handleChange}
                        placeholder="Enter your name..." required error={fieldErrs.name}
                    />
                    <TextField
                        label="Email" type="email" name="email"
                        value={billing.email} onChange={handleChange}
                        placeholder="Enter your email address..." required error={fieldErrs.email}
                    />
                    <TextField
                        label="Phone" type="tel" name="phone"
                        value={billing.phone} onChange={handleChange}
                        placeholder="Enter your phone number..." required error={fieldErrs.phone}
                    />

                    <NavButtons isFirst onNext={goNext} nextLabel="Continue to Address" />
                </div>
            )}

            {/* ── Step 2: Address ───────────────────────────────────────── */}
            {currentStep === 2 && (
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        <h5 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: '700', color: '#1a202c' }}>
                            Billing Address
                        </h5>
                        <p style={{ margin: 0, fontSize: '13px', color: '#718096' }}>
                            Where should we send your receipt?
                        </p>
                    </div>

                    <TextField
                        label="Street Address" type="text" name="address.line1"
                        value={billing.address.line1} onChange={handleChange}
                        placeholder="Enter your street address..." required error={fieldErrs['address.line1']}
                    />
                    <TextField
                        label="Apartment, suite, etc. (optional)" type="text" name="address.line2"
                        value={billing.address.line2} onChange={handleChange}
                        placeholder="Enter apartment, suite, etc. (optional)"
                    />
                    <Row form>
                        <Col md="5">
                            <TextField
                                label="City" type="text" name="address.city"
                                value={billing.address.city} onChange={handleChange}
                                placeholder="Enter your city..." required error={fieldErrs['address.city']}
                            />
                        </Col>
                        <Col md="3">
                            <TextField
                                label="State" type="text" name="address.state"
                                value={billing.address.state} onChange={handleChange}
                                placeholder="e.g. NY" maxLength="2" required error={fieldErrs['address.state']}
                            />
                        </Col>
                        <Col md="4">
                            <TextField
                                label="ZIP Code" type="text" name="address.postal_code"
                                value={billing.address.postal_code} onChange={handleChange}
                                placeholder="Enter ZIP code..." required error={fieldErrs['address.postal_code']}
                            />
                        </Col>
                    </Row>

                    <NavButtons
                        onBack={goBack}
                        onNext={goNext}
                        nextLabel={memorialObituaryId ? 'Continue to Dedication' : 'Continue to Payment'}
                    />
                </div>
            )}

            {/* ── Step 3: Memorial Dedication (conditional) ─────────────── */}
            {currentStep === 3 && memorialObituaryId && (
                <div>
                    <div style={{ marginBottom: '20px' }}>
                        <h5 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: '700', color: '#1a202c' }}>
                            Memorial Dedication
                        </h5>
                        <p style={{ margin: 0, fontSize: '13px', color: '#718096' }}>
                            Your message will appear on the Tribute Wall
                        </p>
                    </div>

                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '20px', marginBottom: '14px' }}>
                        <FormGroup style={{ marginBottom: 0 }}>
                            <FieldLabel>Dedication Message (optional)</FieldLabel>
                            <Input
                                type="textarea"
                                value={dedication}
                                onChange={(e) => setDedication(e.target.value)}
                                placeholder="Write a personal message in memory of your loved one..."
                                rows="4"
                                style={{ border: '1.5px solid #86efac', borderRadius: '8px', fontSize: '15px', resize: 'none' }}
                            />
                        </FormGroup>
                    </div>

                    <NavButtons onBack={goBack} onNext={goNext} nextLabel="Continue to Payment" />
                </div>
            )}

            {/* ── Step 3/4: Payment ─────────────────────────────────────── */}
            {currentStep === PAYMENT_STEP && (
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <h5 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: '700', color: '#1a202c' }}>
                            Payment Details
                        </h5>
                        <p style={{ margin: 0, fontSize: '13px', color: '#718096' }}>
                            Your card information is encrypted and secure
                        </p>
                    </div>

                    {/* Card summary from previous steps */}
                    <div style={{
                        background: '#f7fafc', border: '1px solid #e2e8f0',
                        borderRadius: '10px', padding: '14px 16px', marginBottom: '20px',
                        fontSize: '13px', color: '#4a5568'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: '600' }}>{billing.name}</span>
                            <button
                                type="button"
                                onClick={() => setCurrentStep(1)}
                                style={{ background: 'none', border: 'none', color: '#2d6a4f', fontSize: '12px', cursor: 'pointer', fontWeight: '600', padding: 0 }}
                            >
                                Edit
                            </button>
                        </div>
                        <div>{billing.email} · {billing.phone}</div>
                        <div style={{ marginTop: '2px', color: '#718096' }}>
                            {billing.address.line1}{billing.address.line2 ? `, ${billing.address.line2}` : ''}, {billing.address.city}, {billing.address.state} {billing.address.postal_code}
                        </div>
                    </div>

                    {/* Card number */}
                    <StripeField label="Card Number" error={cardErrors.cardNumber}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ flex: 1 }}>
                                <CardNumberElement
                                    options={{ ...stripeElementStyle, placeholder: '1234 5678 9012 3456', showIcon: true }}
                                    onChange={handleStripeChange('cardNumber')}
                                />
                            </div>
                            {cardBrand !== 'unknown' && (
                                <span style={{
                                    fontSize: '11px', fontWeight: '700', color: brandInfo.color,
                                    border: `1px solid ${brandInfo.color}`, borderRadius: '4px',
                                    padding: '2px 6px', flexShrink: 0, textTransform: 'uppercase'
                                }}>
                                    {brandInfo.label}
                                </span>
                            )}
                        </div>
                    </StripeField>

                    <Row form>
                        <Col xs="6">
                            <StripeField label="Expiry Date" error={cardErrors.cardExpiry}>
                                <CardExpiryElement
                                    options={{ ...stripeElementStyle, placeholder: 'MM / YY' }}
                                    onChange={handleStripeChange('cardExpiry')}
                                />
                            </StripeField>
                        </Col>
                        <Col xs="6">
                            <StripeField label="Security Code" error={cardErrors.cardCvc}>
                                <CardCvcElement
                                    options={{ ...stripeElementStyle, placeholder: 'CVV' }}
                                    onChange={handleStripeChange('cardCvc')}
                                />
                            </StripeField>
                        </Col>
                    </Row>

                    {/* Security note */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '10px 14px', background: '#f0fdf4',
                        border: '1px solid #bbf7d0', borderRadius: '8px', marginBottom: '4px'
                    }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2d6a4f" strokeWidth="2.5">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        <span style={{ fontSize: '12px', color: '#276749' }}>
                            256-bit SSL encrypted · PCI DSS compliant · Powered by Stripe
                        </span>
                    </div>

                    <NavButtons
                        onBack={goBack}
                        nextLabel={`Pay $${(cartTotal || 0).toFixed(2)}`}
                        isProcessing={isProcessing}
                        disabled={!stripe}
                    />

                    <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
                </form>
            )}
        </div>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT-ONLY WRAPPER  (server → neutral placeholder, client → real form)
// ─────────────────────────────────────────────────────────────────────────────
const CheckoutForm = (props) => {
    const [isClient, setIsClient] = useState(false);
    useEffect(() => { setIsClient(true); }, []);

    if (!isClient) {
        return (
            <div style={{ padding: '48px 0', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
                Loading secure checkout...
            </div>
        );
    }

    const { Elements } = require('@stripe/react-stripe-js');
    return (
        <div className="checkout-form-wrapper">
            <Elements stripe={getStripePromise()}>
                <PaymentForm {...props} />
            </Elements>
        </div>
    );
};

const mapStateToProps    = (state) => ({ user: state.account?.user || null });
const mapDispatchToProps = (dispatch) => ({
    clearCart:               () => dispatch(clearCart()),
    showSuccessNotification: (opts) => dispatch(success(opts))
});

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutForm);
