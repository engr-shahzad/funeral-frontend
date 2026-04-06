/**
 * ProductsShop — SSR-safe
 */

import React from 'react';
import { connect } from 'react-redux';
import {
  TreePine, Flower, Gift, Heart,
  Star, Leaf, ShoppingBasket, Wind,
  Archive, Palette, Search, ChevronRight
} from 'lucide-react';
import actions from '../../actions';
import { API_URL } from '../../constants';
import './ProductShop.css';

import ProductList from '../../components/Store/ProductList';
import NotFound from '../../components/Common/NotFound';

// ── SSR guard ──────────────────────────────────────────────────────────────────
const isBrowser = typeof window !== 'undefined';

const session = {
  get:    (key)        => isBrowser ? sessionStorage.getItem(key)    : null,
  set:    (key, value) => isBrowser && sessionStorage.setItem(key, value),
  remove: (key)        => isBrowser && sessionStorage.removeItem(key)
};

const getSearchParam = (search, key) => {
  if (!search) return null;
  try { return new URLSearchParams(search).get(key); } catch { return null; }
};

// ── Sidebar skeleton ────────────────────────────────────────────────────────────
const SidebarSkeleton = () => (
  <>
    {Array.from({ length: 8 }).map((_, i) => (
      <div key={i} className='category-item-skeleton' />
    ))}
  </>
);

class ProductsShop extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      obituaryId:       null,
      filterType:       null,
      selectedCategory: 'best-sellers',
      searchQuery:      '',
      sidebarReady:     false,
      obituaryData:     null,
      obituaryLoading:  false
    };
  }

  CATEGORY_TYPE_MAP = {
    'best-sellers':         null,
    'memorial-trees':       'tree',
    'designers-choice':     'flower',
    'sympathy-plants':      'flower',
    'vase-arrangements':    'flower',
    'flower-baskets':       'flower',
    'funeral-arrangements': 'flower',
    'wreaths-sprays':       'gift',
    'casket-sprays':        'gift',
    'urn-wreaths':          'gift',
    'tribute-blankets':     'gift'
  };

  CATEGORIES = [
    { id: 'best-sellers',         label: 'Best Sellers',                Icon: Star           },
    { id: 'memorial-trees',       label: 'Memorial Trees',              Icon: TreePine       },
    { id: 'designers-choice',     label: "Designer's Choice",           Icon: Palette        },
    { id: 'sympathy-plants',      label: 'Sympathy Plants',             Icon: Leaf           },
    { id: 'vase-arrangements',    label: 'Vase Arrangements',           Icon: Flower         },
    { id: 'flower-baskets',       label: 'Flower Baskets',              Icon: ShoppingBasket },
    { id: 'funeral-arrangements', label: 'Funeral Arrangements',        Icon: Flower         },
    { id: 'wreaths-sprays',       label: 'Wreaths & Specialty Sprays',  Icon: Wind           },
    { id: 'casket-sprays',        label: 'Casket Sprays',               Icon: Gift           },
    { id: 'urn-wreaths',          label: 'Urn Wreaths',                 Icon: Archive        },
    { id: 'tribute-blankets',     label: 'Tribute Blankets',            Icon: Heart          }
  ];

  getObituaryId = () => {
    const search = this.props.location?.search || '';
    return getSearchParam(search, 'obituaryId');
  }

  getFilterParam = () => {
    const search = this.props.location?.search || '';
    return getSearchParam(search, 'filter');
  }

  componentDidMount() {
    const obituaryId = this.getObituaryId();
    const filterType = this.getFilterParam();

    if (obituaryId) {
      this.setState({ obituaryId, filterType });
      session.set('memorial_obituaryId', obituaryId);
      this.props.fetchMemorialProducts(obituaryId, filterType || null);
      this.fetchObituary(obituaryId);
    } else {
      const slug = this.props.match?.params?.slug;
      this.props.filterProducts(slug);
    }

    setTimeout(() => this.setState({ sidebarReady: true }), 80);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location?.search !== this.props.location?.search) {
      const obituaryId = this.getObituaryId();
      const filterType = this.getFilterParam();

      if (obituaryId !== this.state.obituaryId) {
        this.setState({ obituaryId, filterType });
        if (obituaryId) {
          session.set('memorial_obituaryId', obituaryId);
          this.props.fetchMemorialProducts(obituaryId, filterType || null);
          this.fetchObituary(obituaryId);
        } else {
          session.remove('memorial_obituaryId');
          this.setState({ obituaryData: null });
          this.props.filterProducts(this.props.match?.params?.slug);
        }
      }
    }
  }

  fetchObituary = async (id) => {
    this.setState({ obituaryLoading: true });
    try {
      const res = await fetch(`${API_URL}/obituaries/${id}`);
      if (res.ok) {
        const data = await res.json();
        this.setState({ obituaryData: data });
      }
    } catch (_) {
      // silent — banner just won't show
    } finally {
      this.setState({ obituaryLoading: false });
    }
  }

  handleCategorySelect = (category) => {
    const type       = this.CATEGORY_TYPE_MAP[category] ?? null;
    const obituaryId = this.getObituaryId();
    this.setState({ selectedCategory: category, filterType: type });
    if (obituaryId) {
      this.props.fetchMemorialProducts(obituaryId, type);
    }
  }

  handleFilterChange = (type) => {
    const obituaryId = this.getObituaryId();
    this.setState({ filterType: type });
    if (obituaryId) {
      this.props.fetchMemorialProducts(obituaryId, type);
    }
  }

  handleSearchChange = (e) => {
    this.setState({ searchQuery: e.target.value });
  }

  getFilteredProducts = () => {
    const { products } = this.props;
    const { searchQuery } = this.state;
    if (!searchQuery.trim()) return products || [];
    const q = searchQuery.toLowerCase();
    return (products || []).filter(p =>
      p.name?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  }

  // ── Send Love: adds to cart + closes drawer + navigates to checkout ────────────
  handleSendLove = (product) => {
    const { handleAddToCart, toggleCart, history } = this.props;

    // Add product to cart (also opens the cart drawer via toggleCart inside action)
    handleAddToCart(product);

    // Close the cart drawer that handleAddToCart just opened, then go to checkout
    // Use a short tick so the Redux dispatches settle first
    setTimeout(() => {
      toggleCart();                    // close drawer
      history.push('/checkout');       // navigate
    }, 50);
  }

  formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch { return ''; }
  }

  render() {
    const { isLoading, authenticated, updateWishlist } = this.props;
    const { filterType, selectedCategory, searchQuery, sidebarReady,
            obituaryData, obituaryLoading } = this.state;

    const obituaryId       = this.getObituaryId();
    const isMemorialShop   = !!obituaryId;
    const filteredProducts = this.getFilteredProducts();
    const displayProducts  = filteredProducts.length > 0;

    // Obituary banner data
    const firstName  = obituaryData?.firstName || '';
    const lastName   = obituaryData?.lastName  || '';
    const fullName   = `${firstName} ${lastName}`.trim();
    const birthDate  = this.formatDate(obituaryData?.birthDate);
    const deathDate  = this.formatDate(obituaryData?.deathDate);
    const photo      = obituaryData?.primaryPhoto || obituaryData?.photos?.[0] || null;
    const showBanner = !obituaryLoading && obituaryData && isMemorialShop;

    return (
      <div className='products-shop-page'>

        {/* ── Obituary Banner (same as PDP) ──────────────────────── */}
        {isMemorialShop && obituaryLoading && (
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

        {/* ── Shop Layout ────────────────────────────────────────── */}
        <div className='products-shop-container'>

          {/* Sidebar */}
          <aside className='categories-sidebar'>
            <div className='sidebar-heading'>Categories</div>
            {!sidebarReady ? <SidebarSkeleton /> : (
              this.CATEGORIES.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => this.handleCategorySelect(id)}
                  className={`category-item${selectedCategory === id ? ' active' : ''}`}
                >
                  <span className='category-icon-wrap'><Icon size={16} strokeWidth={1.8} /></span>
                  <span className='category-label'>{label}</span>
                  <ChevronRight className='category-arrow' size={14} />
                </button>
              ))
            )}
          </aside>

          {/* Main */}
          <main className='products-main-content'>

            <div className='shop-search-bar'>
              <Search size={17} className='shop-search-icon' />
              <input
                type='text'
                className='shop-search-input'
                placeholder='Search products by name...'
                value={searchQuery}
                onChange={this.handleSearchChange}
                aria-label='Search products'
              />
              {searchQuery && (
                <button
                  className='shop-search-clear'
                  onClick={() => this.setState({ searchQuery: '' })}
                  type='button'
                  aria-label='Clear search'
                >&times;</button>
              )}
            </div>

            {/* Memorial Banner */}
            {isMemorialShop && (
              <div className='memorial-banner'>
                <div className='memorial-banner-content'>
                  <div className='memorial-banner-header'>
                    <TreePine size={30} />
                    <div>
                      <h2 className='memorial-banner-title'>Plant a Memorial Tree</h2>
                      <p className='memorial-banner-subtitle'>Honor their memory with a living tribute</p>
                    </div>
                  </div>
                  <p className='memorial-banner-description'>
                    Each tree planted helps create a lasting legacy and supports reforestation efforts.
                  </p>
                </div>
              </div>
            )}

            {/* Memorial Filters */}
            {isMemorialShop && (
              <div className='memorial-filters'>
                <div className='memorial-filters-content'>
                  <p className='memorial-filters-title'>Filter by type</p>
                  <div className='memorial-filters-buttons'>
                    <button onClick={() => this.handleFilterChange(null)}     className={`filter-btn${!filterType ? ' active' : ''}`}>
                      <Heart size={15} /> All Tributes
                    </button>
                    <button onClick={() => this.handleFilterChange('tree')}   className={`filter-btn filter-btn-tree${filterType === 'tree' ? ' active' : ''}`}>
                      <TreePine size={15} /> Trees
                    </button>
                    <button onClick={() => this.handleFilterChange('flower')} className={`filter-btn filter-btn-flower${filterType === 'flower' ? ' active' : ''}`}>
                      <Flower size={15} /> Flowers
                    </button>
                    <button onClick={() => this.handleFilterChange('gift')}   className={`filter-btn filter-btn-gift${filterType === 'gift' ? ' active' : ''}`}>
                      <Gift size={15} /> Memorial Gifts
                    </button>
                  </div>
                </div>
              </div>
            )}

            {(isLoading || displayProducts) && (
              <ProductList
                products={filteredProducts}
                authenticated={authenticated}
                updateWishlist={updateWishlist}
                obituaryId={obituaryId}
                isLoading={isLoading}
                skeletonCount={8}
                onSendLove={this.handleSendLove}
              />
            )}

            {!isLoading && !displayProducts && (
              <div className='products-empty-state'>
                {searchQuery ? (
                  <>
                    <Search size={40} className='empty-icon' />
                    <h3 className='empty-title'>No results for "{searchQuery}"</h3>
                    <p className='empty-description'>Try a different keyword or clear the search.</p>
                  </>
                ) : isMemorialShop ? (
                  <>
                    <TreePine size={40} className='empty-icon' />
                    <h3 className='empty-title'>No memorial products available</h3>
                    <p className='empty-description'>Please check back later or contact us for custom options.</p>
                  </>
                ) : (
                  <NotFound message='No products found.' />
                )}
              </div>
            )}

            {!isLoading && displayProducts && (
              <p className='products-count'>
                Showing {filteredProducts.length} {isMemorialShop ? 'memorial ' : ''}
                product{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            )}

          </main>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  products:      state.product.storeProducts,
  isLoading:     state.product.isLoading,
  authenticated: state.authentication.authenticated
});

export default connect(mapStateToProps, actions)(ProductsShop);
