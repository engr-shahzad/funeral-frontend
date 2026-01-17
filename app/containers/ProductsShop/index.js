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

  componentDidMount() {
    console.log('🛒 ProductsShop mounted');

    // Check if this is a memorial shop visit (from obituary page)
    const searchParams = new URLSearchParams(window.location.search);
    const obituaryId = searchParams.get('obituaryId');
    const filterType = searchParams.get('filter');

    console.log('📋 URL Params:', { obituaryId, filterType });

    if (obituaryId) {
      // Memorial products view
      this.setState({ obituaryId, filterType });
      console.log('🌳 Fetching memorial products for obituary:', obituaryId);
      this.props.fetchMemorialProducts(obituaryId, filterType || null);
    } else {
      // Regular shop view
      const slug = this.props.match.params.slug;
      console.log('🛍️ Regular shop - filtering products:', slug);
      this.props.filterProducts(slug);
    }
  }

  componentDidUpdate(prevProps) {
    // Handle navigation changes
    const searchParams = new URLSearchParams(window.location.search);
    const obituaryId = searchParams.get('obituaryId');

    if (obituaryId !== this.state.obituaryId) {
      this.componentDidMount();
    }
  }

  handleFilterChange = (type) => {
    const { obituaryId } = this.state;

    this.setState({ filterType: type });

    if (obituaryId) {
      console.log(`🔄 Filtering memorial products by type: ${type}`);
      this.props.fetchMemorialProducts(obituaryId, type);
    }
  }

  handleCategorySelect = (category) => {
    this.setState({ selectedCategory: category });
    // You can add logic here to filter products by category if needed
  }

  render() {
    const { products, isLoading, authenticated, updateWishlist } = this.props;
    const { obituaryId, filterType, selectedCategory } = this.state;

    const displayProducts = products && products.length > 0;
    const isMemorialShop = !!obituaryId;

    // Categories matching the screenshot
    const categories = [
      { id: 'best-sellers', label: 'Best Sellers', icon: '★' },
      { id: 'memorial-trees', label: 'Memorial Trees', icon: '🌳' },
      { id: 'designers-choice', label: "Designer's Choice", icon: '🌺' },
      { id: 'sympathy-plants', label: 'Sympathy Plants', icon: '🪴' },
      { id: 'vase-arrangements', label: 'Vase Arrangements', icon: '💐' },
      { id: 'flower-baskets', label: 'Flower Baskets', icon: '🧺' },
      { id: 'funeral-arrangements', label: 'Funeral Arrangements', icon: '⚘' },
      { id: 'wreaths-sprays', label: 'Wreaths and Specialty Sprays', icon: '🌿' },
      { id: 'casket-sprays', label: 'Casket Sprays', icon: '💮' },
      { id: 'urn-wreaths', label: 'Urn Wreaths', icon: '🏺' },
      { id: 'tribute-blankets', label: 'Tribute Blankets', icon: '🧸' }
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
                    onClick={() => this.handleFilterChange('tree')}
                    className={`filter-btn filter-btn-flower ${filterType === 'tree' ? 'active' : ''}`}
                  >
                    <Flower size={16} />
                    Flowers
                  </button>

                  <button
                    onClick={() => this.handleFilterChange('tree')}
                    className={`filter-btn filter-btn-gift ${filterType === 'tree' ? 'active' : ''}`}
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
