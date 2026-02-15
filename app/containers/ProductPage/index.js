/**
 *
 * ProductPage - Memorial Tree Style (Screenshot Match)
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './Product.css';

import actions from '../../actions';
import Button from '../../components/Common/Button';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import NotFound from '../../components/Common/NotFound';

class ProductPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedVariant: null,
      quantity: 1,
      openFaqIndex: null,
      obituaryId: null
    };
  }

  componentDidMount() {
    const identifier = this.props.match.params.slug;
    this.loadProduct(identifier);
    document.body.classList.add('product-page');

    // Carry obituary context from URL query params
    const searchParams = new URLSearchParams(window.location.search);
    const obituaryId = searchParams.get('obituaryId');
    if (obituaryId) {
      this.setState({ obituaryId });
      sessionStorage.setItem('memorial_obituaryId', obituaryId);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      const identifier = this.props.match.params.slug;
      this.loadProduct(identifier);
    }

    // Set default variant when product loads
    if (
      prevProps.product !== this.props.product &&
      this.props.product.variants &&
      this.props.product.variants.length > 0
    ) {
      if (!this.state.selectedVariant) {
        const defaultVariant =
          this.props.product.variants.find(v => v.isDefault) ||
          this.props.product.variants[0];
        this.setState({ selectedVariant: defaultVariant });
      }
    }
  }

  componentWillUnmount() {
    document.body.classList.remove('product-page');
  }

  loadProduct(identifier) {
    const isMongoId = /^[a-f\d]{24}$/i.test(identifier);

    if (isMongoId) {
      this.props.fetchStoreProduct(identifier, true);
    } else {
      this.props.fetchStoreProduct(identifier, false);
      this.props.fetchProductReviews(identifier);
    }
  }

  handleVariantSelect = variant => {
    this.setState({ selectedVariant: variant });
  };

  handleAddToCartWithVariant = () => {
    const { product, handleAddToCart } = this.props;
    const { selectedVariant, quantity, obituaryId } = this.state;

    if (!selectedVariant) {
      alert('Please select a variant');
      return;
    }

    const productWithPrice = {
      ...product,
      price: selectedVariant.price,
      selectedVariant: selectedVariant,
      variantId: selectedVariant._id,
      variantName: selectedVariant.name,
      quantity: quantity
    };

    // Store obituary context in sessionStorage for checkout
    if (obituaryId) {
      sessionStorage.setItem('memorial_obituaryId', obituaryId);
    }

    handleAddToCart(productWithPrice);

    // Close the cart drawer (handleAddToCart opens it) and navigate to checkout page
    this.props.toggleCart();
    this.props.history.push('/checkout');
  };

  toggleFaq = index => {
    this.setState(prevState => ({
      openFaqIndex: prevState.openFaqIndex === index ? null : index
    }));
  };

  render() {
    const { isLoading, product } = this.props;
    const { selectedVariant, openFaqIndex } = this.state;

    const hasVariants = product.variants && product.variants.length > 0;
    const displayPrice =
      hasVariants && selectedVariant ? selectedVariant.price : product.price;
    const originalPrice = displayPrice ? (displayPrice / 0.8).toFixed(2) : 0;

    // FAQ Data
    const faqs = [
      {
        question: 'How does the memorial tree planting process work?',
        answer:
          'After you purchase a memorial tree, we partner with certified forestry organizations to plant your tree in a designated reforestation area. You will receive a certificate with the location and details of your planted tree.'
      },
      {
        question: 'What species of trees are planted?',
        answer:
          'We plant native species appropriate to the reforestation area, including oak, maple, pine, and other indigenous trees that support local ecosystems.'
      },
      {
        question: 'Why plant a memorial tree?',
        answer:
          'Memorial trees create a living legacy that honors your loved one while contributing to environmental restoration. Each tree helps combat climate change and supports wildlife habitats.'
      },
      {
        question: 'What impact does a memorial tree have on the environment?',
        answer:
          'Each memorial tree absorbs CO2, produces oxygen, prevents soil erosion, and provides habitat for wildlife. Over its lifetime, a single tree can offset tons of carbon emissions.'
      },
      {
        question: 'How does planting a memorial tree honor a loved one?',
        answer:
          'A memorial tree creates a lasting tribute that grows stronger over time, symbolizing the enduring impact of your loved one\'s life. Your name will be added to their Tribute Wall, and you\'ll receive a certificate of dedication.'
      }
    ];

    return (
      <div className='memorial-product-page'>
        {isLoading ? (
          <LoadingIndicator />
        ) : Object.keys(product).length > 0 ? (
          <>
            {/* Hero Section with Forest Background */}

            {/* Product Content Section */}
            <div className='memorial-content-wrapper'>
              <div className='memorial-product-grid'>
                {/* Left - Product Image */}
                <div className='memorial-image-section'>
                  <img
                    className='memorial-tree-image'
                    src={
                      product.imageUrl ||
                      product.images?.[0]?.url ||
                      '/images/placeholder-image.png'
                    }
                    alt={product.name}
                  />

                  {/* Partnership Logo */}
                  <div className='partnership-badge'>
                    <p className='partnership-label'>In Partnership With:</p>
                    <div className='partnership-logo-wrapper'>
                      <div className='partnership-logo-circle'>
                        <svg
                          className='tree-logo-icon'
                          fill='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path d='M12 2L4 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-8-5z' />
                        </svg>
                      </div>
                    </div>
                    <p className='partnership-name'>
                      A TREE <span className='to-word'>to</span> REMEMBER™
                    </p>
                  </div>
                </div>

                {/* Right - Product Details */}
                <div className='memorial-details-section'>
                  <div className='memorial-product-header'>
                    <h3 className='memorial-product-title'>{product.name}</h3>
                    <div className='memorial-pricing'>
                      <span className='price-strikethrough'>${originalPrice}</span>
                      <span className='price-current'>
                        ${displayPrice ? displayPrice.toFixed(2) : '0.00'}
                      </span>
                    </div>
                  </div>

                  {/* Product Highlights */}
                  {product.highlights && product.highlights.length > 0 && (
                    <ul className='memorial-highlights-list'>
                      {product.highlights.map((highlight, index) => (
                        <li key={index} className='memorial-highlight-item'>
                          • {highlight}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Variant Selection Buttons */}
                  {hasVariants && (
                    <div className='memorial-variants-section'>
                      <div className='memorial-variants-grid'>
                        {product.variants.map(variant => (
                          <button
                            key={variant._id}
                            onClick={() => this.handleVariantSelect(variant)}
                            className={`memorial-variant-btn ${
                              selectedVariant &&
                              selectedVariant._id === variant._id
                                ? 'active'
                                : ''
                            }`}
                          >
                            {variant.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Continue to Checkout Button */}
                  <button
                    className='memorial-checkout-btn'
                    onClick={this.handleAddToCartWithVariant}
                    disabled={!selectedVariant}
                  >
                    CONTINUE TO CHECKOUT
                  </button>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className='memorial-faq-section'>
              <h2 className='faq-title'>Frequently asked questions</h2>
              <div className='faq-list'>
                {faqs.map((faq, index) => (
                  <div key={index} className='faq-item'>
                    <button
                      className='faq-question-btn'
                      onClick={() => this.toggleFaq(index)}
                    >
                      <span className='faq-question-text'>{faq.question}</span>
                      <span className='faq-icon'>
                        {openFaqIndex === index ? '−' : '+'}
                      </span>
                    </button>
                    {openFaqIndex === index && (
                      <div className='faq-answer'>
                        <p>{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Shop All Sympathy Gifts Section */}
            <div className='sympathy-cta-section'>
              <h3 className='sympathy-cta-title'>
                Not seeing quite what you're looking for yet?
              </h3>
              <p className='sympathy-cta-subtitle'>
                Explore our full collection to find the perfect sympathy gift.
              </p>
              <Link to='/shop/sympathy' className='sympathy-cta-btn'>
                Shop all sympathy gifts
              </Link>
            </div>
          </>
        ) : (
          <NotFound message='No product found.' />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    product: state.product.storeProduct,
    isLoading: state.product.isLoading
  };
};

export default connect(mapStateToProps, actions)(ProductPage);