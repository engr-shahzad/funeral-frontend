/**
 * ProductPage — Memorial Product with Obituary Banner
 */

import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import './Product.css';

import actions from '../../actions';
import NotFound from '../../components/Common/NotFound';
import { API_URL } from '../../constants';

class ProductPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedVariant: null,
      quantity:        1,
      openFaqIndex:    null,
      obituaryId:      null,
      obituaryData:    null,
      obituaryLoading: false
    };
  }

  componentDidMount() {
    const identifier = this.props.match.params.slug;
    this.loadProduct(identifier);
    document.body.classList.add('product-page');

    const searchParams = new URLSearchParams(window.location.search);
    const obituaryId = searchParams.get('obituaryId');
    if (obituaryId) {
      this.setState({ obituaryId });
      sessionStorage.setItem('memorial_obituaryId', obituaryId);
      this.fetchObituary(obituaryId);
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.slug !== prevProps.match.params.slug) {
      this.loadProduct(this.props.match.params.slug);
    }

    if (
      prevProps.product !== this.props.product &&
      this.props.product.variants?.length > 0
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

  fetchObituary = async (id) => {
    this.setState({ obituaryLoading: true });
    try {
      const response = await fetch(`${API_URL}/obituaries/${id}`);
      if (response.ok) {
        const data = await response.json();
        this.setState({ obituaryData: data });
      }
    } catch (err) {
      // silent — banner just won't show
    } finally {
      this.setState({ obituaryLoading: false });
    }
  }

  handleVariantSelect = variant => {
    this.setState({ selectedVariant: variant });
  };

  handleSendLove = () => {
    const { product, handleAddToCart } = this.props;
    const { selectedVariant, quantity, obituaryId } = this.state;

    if (!selectedVariant) {
      alert('Please select a size / option first');
      return;
    }

    const productWithPrice = {
      ...product,
      price:           selectedVariant.price,
      selectedVariant,
      variantId:       selectedVariant._id,
      variantName:     selectedVariant.name,
      quantity
    };

    if (obituaryId) {
      sessionStorage.setItem('memorial_obituaryId', obituaryId);
    }

    handleAddToCart(productWithPrice);
    this.props.history.push('/checkout');
  };

  toggleFaq = index => {
    this.setState(prevState => ({
      openFaqIndex: prevState.openFaqIndex === index ? null : index
    }));
  };

  formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return ''; }
  };

  render() {
    const { isLoading, product } = this.props;
    const { selectedVariant, openFaqIndex, obituaryData, obituaryLoading } = this.state;

    const hasVariants   = product.variants && product.variants.length > 0;
    const displayPrice  = hasVariants && selectedVariant ? selectedVariant.price : product.price;
    const originalPrice = displayPrice ? (displayPrice / 0.8).toFixed(2) : 0;

    // Obituary display fields
    const firstName  = obituaryData?.firstName || '';
    const lastName   = obituaryData?.lastName  || '';
    const fullName   = `${firstName} ${lastName}`.trim();
    const birthDate  = this.formatDate(obituaryData?.birthDate);
    const deathDate  = this.formatDate(obituaryData?.deathDate);
    const photo      = obituaryData?.primaryPhoto || obituaryData?.photos?.[0] || null;
    const showBanner = !obituaryLoading && obituaryData;

    const faqs = [
      {
        question: 'How does the memorial tree planting process work?',
        answer:   'After you purchase a memorial tree, we partner with certified forestry organizations to plant your tree in a designated reforestation area. You will receive a certificate with the location and details of your planted tree.'
      },
      {
        question: 'What species of trees are planted?',
        answer:   'We plant native species appropriate to the reforestation area, including oak, maple, pine, and other indigenous trees that support local ecosystems.'
      },
      {
        question: 'Why plant a memorial tree?',
        answer:   'Memorial trees create a living legacy that honors your loved one while contributing to environmental restoration. Each tree helps combat climate change and supports wildlife habitats.'
      },
      {
        question: 'What impact does a memorial tree have on the environment?',
        answer:   'Each memorial tree absorbs CO₂, produces oxygen, prevents soil erosion, and provides habitat for wildlife. Over its lifetime, a single tree can offset tons of carbon emissions.'
      },
      {
        question: 'How does planting a memorial tree honor a loved one?',
        answer:   "A memorial tree creates a lasting tribute that grows stronger over time, symbolizing the enduring impact of your loved one's life. Your name will be added to their Tribute Wall, and you'll receive a certificate of dedication."
      }
    ];

    return (
      <div className='memorial-product-page'>

        {/* ── Obituary Banner ─────────────────────────────────────── */}
        {obituaryLoading && (
          <div className='obit-banner-skeleton'>
            <div className='obit-skeleton-circle' />
            <div className='obit-skeleton-lines'>
              <div className='obit-skeleton-line wide' />
              <div className='obit-skeleton-line medium' />
              <div className='obit-skeleton-line narrow' />
            </div>
          </div>
        )}

        {showBanner && (
          <div className='obit-banner'>
            <div className='obit-banner-overlay' />
            <div className='obit-banner-content'>
              {/* Circular photo */}
              <div className='obit-banner-photo-ring'>
                <img
                  className='obit-banner-photo'
                  src={photo || 'https://via.placeholder.com/160x160?text=Photo'}
                  alt={fullName}
                  onError={e => { e.target.src = 'https://via.placeholder.com/160x160?text=Photo'; }}
                />
              </div>

              <p className='obit-banner-label'>In Loving Memory of</p>
              <h1 className='obit-banner-name'>{fullName}</h1>

              {(birthDate || deathDate) && (
                <p className='obit-banner-dates'>
                  {birthDate && <span>{birthDate}</span>}
                  {birthDate && deathDate && <span className='obit-date-sep'>—</span>}
                  {deathDate && <span>{deathDate}</span>}
                </p>
              )}

              <p className='obit-banner-quote'>
                "Those we love don't go away, they walk beside us every day —
                unseen, unheard, but always near, still loved, still missed,
                and very dear."
              </p>

              <div className='obit-banner-divider'>
                <Heart size={14} className='obit-banner-heart' />
              </div>
            </div>
          </div>
        )}

        {/* ── Product Section ─────────────────────────────────────── */}
        {isLoading ? (
          <div className='product-skeleton-wrapper'>
            <div className='product-skeleton-grid'>
              <div className='product-skeleton-image' />
              <div className='product-skeleton-details'>
                <div className='ps-line ps-title' />
                <div className='ps-line ps-subtitle' />
                <div className='ps-line ps-price' />
                <div className='ps-btn' />
              </div>
            </div>
          </div>
        ) : Object.keys(product).length > 0 ? (
          <>
            <div className='memorial-content-wrapper'>
              <div className='memorial-product-grid'>

                {/* Left — Product Image */}
                <div className='memorial-image-section'>
                  <img
                    className='memorial-tree-image'
                    src={product.imageUrl || product.images?.[0]?.url || '/images/placeholder-image.png'}
                    alt={product.name}
                  />

                  <div className='partnership-badge'>
                    <p className='partnership-label'>In Partnership With:</p>
                    <div className='partnership-logo-wrapper'>
                      <div className='partnership-logo-circle'>
                        <svg className='tree-logo-icon' fill='currentColor' viewBox='0 0 24 24'>
                          <path d='M12 2L4 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-8-5z' />
                        </svg>
                      </div>
                    </div>
                    <p className='partnership-name'>A TREE <span className='to-word'>to</span> REMEMBER™</p>
                  </div>
                </div>

                {/* Right — Product Details */}
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

                  {product.highlights?.length > 0 && (
                    <ul className='memorial-highlights-list'>
                      {product.highlights.map((h, i) => (
                        <li key={i} className='memorial-highlight-item'>• {h}</li>
                      ))}
                    </ul>
                  )}

                  {hasVariants && (
                    <div className='memorial-variants-section'>
                      <div className='memorial-variants-grid'>
                        {product.variants.map(variant => (
                          <button
                            key={variant._id}
                            onClick={() => this.handleVariantSelect(variant)}
                            className={`memorial-variant-btn${selectedVariant?._id === variant._id ? ' active' : ''}`}
                          >
                            {variant.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Send Love Button */}
                  <button
                    className='memorial-send-love-btn'
                    onClick={this.handleSendLove}
                    disabled={!selectedVariant}
                  >
                    <Heart size={18} strokeWidth={2.5} />
                    Send Love
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
                      <span className='faq-icon'>{openFaqIndex === index ? '−' : '+'}</span>
                    </button>
                    {openFaqIndex === index && (
                      <div className='faq-answer'><p>{faq.answer}</p></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className='sympathy-cta-section'>
              <h3 className='sympathy-cta-title'>Not seeing quite what you're looking for yet?</h3>
              <p className='sympathy-cta-subtitle'>Explore our full collection to find the perfect sympathy gift.</p>
              <Link to='/shop/sympathy' className='sympathy-cta-btn'>Shop all sympathy gifts</Link>
            </div>
          </>
        ) : (
          <NotFound message='No product found.' />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  product:   state.product.storeProduct,
  isLoading: state.product.isLoading
});

export default connect(mapStateToProps, actions)(ProductPage);
