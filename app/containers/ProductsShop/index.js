/**
 * ProductsShop — SSR-safe
 *
 * SSR notes:
 * - window.location replaced with this.props.location (react-router)
 * - All sessionStorage access is guarded with isBrowser check
 * - Component renders correctly on both server and client
 */

import React from 'react';
import { connect } from 'react-redux';
import {
  TreePine, Flower, Gift, Heart,
  Star, Leaf, ShoppingBasket, Wind,
  Archive, Palette, Search, ChevronRight
} from 'lucide-react';
import actions from '../../actions';
import './ProductShop.css';

import ProductList from '../../components/Store/ProductList';
import NotFound from '../../components/Common/NotFound';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

// ── SSR guard ──────────────────────────────────────────────────────────────────
const isBrowser = typeof window !== 'undefined';

const session = {
  get:    (key)        => isBrowser ? sessionStorage.getItem(key)    : null,
  set:    (key, value) => isBrowser && sessionStorage.setItem(key, value),
  remove: (key)        => isBrowser && sessionStorage.removeItem(key)
};

// ── Helpers ────────────────────────────────────────────────────────────────────
// Parse search string from react-router location (works on server too)
const getSearchParam = (search, key) => {
  if (!search) return null;
  // URLSearchParams is available in Node 10+ and all modern browsers
  try {
    return new URLSearchParams(search).get(key);
  } catch {
    return null;
  }
};

class ProductsShop extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      obituaryId:       null,
      filterType:       null,
      selectedCategory: 'best-sellers',
      searchQuery:      ''
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

  // Use react-router location prop — safe on server and client
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
    } else {
      const slug = this.props.match?.params?.slug;
      this.props.filterProducts(slug);
    }
  }

  componentDidUpdate(prevProps) {
    // React to URL changes (back/forward navigation)
    if (prevProps.location?.search !== this.props.location?.search) {
      const obituaryId = this.getObituaryId();
      const filterType = this.getFilterParam();

      if (obituaryId !== this.state.obituaryId) {
        this.setState({ obituaryId, filterType });
        if (obituaryId) {
          session.set('memorial_obituaryId', obituaryId);
          this.props.fetchMemorialProducts(obituaryId, filterType || null);
        } else {
          session.remove('memorial_obituaryId');
          this.props.filterProducts(this.props.match?.params?.slug);
        }
      }
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

  render() {
    const { isLoading, authenticated, updateWishlist } = this.props;
    const { filterType, selectedCategory, searchQuery } = this.state;

    // Derive obituaryId from URL at render time (consistent on server + client)
    const obituaryId      = this.getObituaryId();
    const isMemorialShop  = !!obituaryId;
    const filteredProducts = this.getFilteredProducts();
    const displayProducts  = filteredProducts.length > 0;

    return (
      <div className='products-shop-container'>

        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <aside className='categories-sidebar'>
          <div className='sidebar-heading'>Categories</div>
          {this.CATEGORIES.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => this.handleCategorySelect(id)}
              className={`category-item${selectedCategory === id ? ' active' : ''}`}
            >
              <span className='category-icon-wrap'>
                <Icon size={16} strokeWidth={1.8} />
              </span>
              <span className='category-label'>{label}</span>
              <ChevronRight className='category-arrow' size={14} />
            </button>
          ))}
        </aside>

        {/* ── Main Content ──────────────────────────────────────────── */}
        <main className='products-main-content'>

          {/* Search bar */}
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
              >
                &times;
              </button>
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

          {/* Loading */}
          {isLoading && <LoadingIndicator />}

          {/* Products grid */}
          {displayProducts && !isLoading && (
            <ProductList
              products={filteredProducts}
              authenticated={authenticated}
              updateWishlist={updateWishlist}
              obituaryId={obituaryId}
            />
          )}

          {/* Empty state */}
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

          {/* Count */}
          {displayProducts && (
            <p className='products-count'>
              Showing {filteredProducts.length} {isMemorialShop ? 'memorial ' : ''}
              product{filteredProducts.length !== 1 ? 's' : ''}
            </p>
          )}

        </main>
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
