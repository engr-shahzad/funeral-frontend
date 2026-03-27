/**
 *
 * ProductsShop - Updated with Memorial Products Support & Category Sidebar
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { TreePine, Flower, Gift, Heart, ChevronRight } from 'lucide-react';
import actions from '../../actions';
import "./ProductShop.css"

import ProductList from '../../components/Store/ProductList';
import NotFound from '../../components/Common/NotFound';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

class ProductsShop extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      obituaryId: null,
      filterType: null,
      selectedCategory: 'best-sellers'
    };
  }

  CATEGORY_TYPE_MAP = {
    'best-sellers':          null,
    'memorial-trees':        'tree',
    'designers-choice':      'flower',
    'sympathy-plants':       'flower',
    'vase-arrangements':     'flower',
    'flower-baskets':        'flower',
    'funeral-arrangements':  'flower',
    'wreaths-sprays':        'flower',
    'casket-sprays':         'gift',
    'urn-wreaths':           'gift',
    'tribute-blankets':      'gift'
  };

  // Helper - always fresh obituaryId from URL
  getObituaryId = () => {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get('obituaryId');
  }

  componentDidMount() {
    const searchParams = new URLSearchParams(window.location.search);
    const obituaryId = searchParams.get('obituaryId');
    const filterType = searchParams.get('filter');

    if (obituaryId) {
      this.setState({ obituaryId, filterType });
      sessionStorage.setItem('memorial_obituaryId', obituaryId);
      this.props.fetchMemorialProducts(obituaryId, filterType || null);
    } else {
      const slug = this.props.match.params.slug;
      this.props.filterProducts(slug);
    }
  }

  componentDidUpdate(prevProps) {
    const obituaryId = this.getObituaryId();

    if (obituaryId !== this.state.obituaryId) {
      this.componentDidMount();
    }
  }

  handleFilterChange = (type) => {
    // Always read from URL - don't depend on state
    const obituaryId = this.getObituaryId();

    this.setState({ filterType: type });

    if (obituaryId) {
      this.props.fetchMemorialProducts(obituaryId, type);
    }
  }

  handleCategorySelect = (category) => {
    const type = this.CATEGORY_TYPE_MAP[category] ?? null;
    
    this.setState({ selectedCategory: category });
    
    // Always read from URL - don't depend on state
    const obituaryId = this.getObituaryId();

    this.setState({ filterType: type });

    if (obituaryId) {
      this.props.fetchMemorialProducts(obituaryId, type);
    }
  }

  render() {
    const { products, isLoading, authenticated, updateWishlist } = this.props;
    const { obituaryId, filterType, selectedCategory } = this.state;

    const displayProducts = products && products.length > 0;
    const isMemorialShop = !!obituaryId;

    const categories = [
      { id: 'best-sellers',         label: 'Best Sellers',                 icon: '★' },
      { id: 'memorial-trees',       label: 'Memorial Trees',               icon: '🌳' },
      { id: 'designers-choice',     label: "Designer's Choice",            icon: '🌺' },
      { id: 'sympathy-plants',      label: 'Sympathy Plants',              icon: '🪴' },
      { id: 'vase-arrangements',    label: 'Vase Arrangements',            icon: '💐' },
      { id: 'flower-baskets',       label: 'Flower Baskets',               icon: '🧺' },
      { id: 'funeral-arrangements', label: 'Funeral Arrangements',         icon: '⚘'  },
      { id: 'wreaths-sprays',       label: 'Wreaths and Specialty Sprays', icon: '🌿' },
      { id: 'casket-sprays',        label: 'Casket Sprays',                icon: '💮' },
      { id: 'urn-wreaths',          label: 'Urn Wreaths',                  icon: '🏺' },
      { id: 'tribute-blankets',     label: 'Tribute Blankets',             icon: '🧸' }
    ];

    return (
      <div className='products-shop-container'>
        {/* Sidebar Categories */}
        <aside className='categories-sidebar'>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => this.handleCategorySelect(category.id)}
              className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
            >
              <span className='category-icon'>{category.icon}</span>
              <span className='category-label'>{category.label}</span>
              <ChevronRight className='category-arrow' size={16} />
            </button>
          ))}
        </aside>

        {/* Main Content */}
        <main className='products-main-content'>
          {/* Memorial Banner */}
          {isMemorialShop && (
            <div className='memorial-banner'>
              <div className='memorial-banner-content'>
                <div className='memorial-banner-header'>
                  <TreePine size={32} />
                  <div>
                    <h2 className='memorial-banner-title'>
                      Plant a Memorial Tree
                    </h2>
                    <p className='memorial-banner-subtitle'>
                      Honor their memory with a living tribute
                    </p>
                  </div>
                </div>
                <p className='memorial-banner-description'>
                  Each tree planted helps create a lasting legacy and supports reforestation efforts.
                </p>
              </div>
            </div>
          )}

          {/* Memorial Product Type Filters */}
          {isMemorialShop && (
            <div className='memorial-filters'>
              <div className='memorial-filters-content'>
                <h3 className='memorial-filters-title'>Memorial Tributes</h3>
                <div className='memorial-filters-buttons'>
                  <button
                    onClick={() => this.handleFilterChange(null)}
                    className={`filter-btn ${!filterType ? 'active' : ''}`}
                  >
                    <Heart size={16} />
                    All Tributes
                  </button>

                  <button
                    onClick={() => this.handleFilterChange('tree')}
                    className={`filter-btn filter-btn-tree ${filterType === 'tree' ? 'active' : ''}`}
                  >
                    <TreePine size={16} />
                    Trees
                  </button>

                  <button
                    onClick={() => this.handleFilterChange('flower')}
                    className={`filter-btn filter-btn-flower ${filterType === 'flower' ? 'active' : ''}`}
                  >
                    <Flower size={16} />
                    Flowers
                  </button>

                  <button
                    onClick={() => this.handleFilterChange('gift')}
                    className={`filter-btn filter-btn-gift ${filterType === 'gift' ? 'active' : ''}`}
                  >
                    <Gift size={16} />
                    Memorial Gifts
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && <LoadingIndicator />}

          {/* Products List */}
          {displayProducts && !isLoading && (
            <ProductList
              products={products}
              authenticated={authenticated}
              updateWishlist={updateWishlist}
              obituaryId={obituaryId}
            />
          )}

          {/* No Products Found */}
          {!isLoading && !displayProducts && (
            <div className='products-empty-state'>
              {isMemorialShop ? (
                <div>
                  <TreePine className='empty-icon' size={48} />
                  <h3 className='empty-title'>
                    No memorial products available
                  </h3>
                  <p className='empty-description'>
                    Please check back later or contact us for custom memorial options.
                  </p>
                </div>
              ) : (
                <NotFound message='No products found.' />
              )}
            </div>
          )}

          {/* Product Count */}
          {displayProducts && isMemorialShop && (
            <div className='products-count'>
              Showing {products.length} memorial {filterType || 'tribute'}{products.length !== 1 ? 's' : ''}
            </div>
          )}
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    products: state.product.storeProducts,
    isLoading: state.product.isLoading,
    authenticated: state.authentication.authenticated
  };
};

export default connect(mapStateToProps, actions)(ProductsShop);