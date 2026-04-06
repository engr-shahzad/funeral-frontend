/**
 *
 * ProductList - Memorial Style Product Cards with "Send Love"
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import AddToWishList from '../AddToWishList';
import './Productlist.css';

// ── Skeleton Card ──────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className='product-card skeleton-card'>
    <div className='skeleton-image-wrapper' />
    <div className='product-info'>
      <div className='skeleton-line skeleton-title' />
      <div className='skeleton-line skeleton-subtitle' />
      <div className='skeleton-line skeleton-price' />
      <div className='skeleton-btn' />
    </div>
  </div>
);

class ProductList extends React.Component {
  constructor(props) {
    super(props);

    const initialVariants = {};
    (props.products || []).forEach((product, index) => {
      const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];
      initialVariants[index] = defaultVariant;
    });

    this.state = {
      selectedVariants: initialVariants
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.products !== this.props.products) {
      const initialVariants = {};
      (this.props.products || []).forEach((product, index) => {
        const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];
        initialVariants[index] = defaultVariant;
      });
      this.setState({ selectedVariants: initialVariants });
    }
  }

  handleVariantChange = (productIndex, variantIndex) => {
    const { products } = this.props;
    const selectedVariant = products[productIndex].variants[variantIndex];
    this.setState(prevState => ({
      selectedVariants: { ...prevState.selectedVariants, [productIndex]: selectedVariant }
    }));
  }

  getProductPrice = (product, productIndex) => {
    const { selectedVariants } = this.state;
    if (product.variants && product.variants.length > 0) {
      const selectedVariant = selectedVariants[productIndex];
      return selectedVariant?.price || product.variants[0].price;
    }
    return product.price;
  }

  onSendLove = (e, product, productIndex) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    const { onSendLove } = this.props;
    const { selectedVariants } = this.state;

    if (onSendLove) {
      const selectedVariant = selectedVariants[productIndex];
      // Pass the fully built product to the parent — parent handles cart + navigation
      const productWithVariant = {
        ...product,
        selectedVariant,
        price: selectedVariant?.price || product.price,
        variant: selectedVariant?.name,
        quantity: 1
      };
      onSendLove(productWithVariant);
    }
  }

  getProductLink = (product) => {
    const { obituaryId } = this.props;
    const base = `/product/${product.slug || product._id}`;
    return obituaryId ? `${base}?obituaryId=${obituaryId}` : base;
  }

  render() {
    const { products, updateWishlist, authenticated, isLoading, skeletonCount = 8 } = this.props;
    const { selectedVariants } = this.state;

    // Show skeleton cards while loading
    if (isLoading) {
      return (
        <div className='products-grid'>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      );
    }

    const reversedProducts = [...(products || [])].reverse();

    return (
      <div className='products-grid'>
        {reversedProducts.map((product, productIndex) => {
          const originalIndex = products.length - 1 - productIndex;
          const displayPrice = this.getProductPrice(product, originalIndex);
          const hasVariants = product.variants && product.variants.length > 0;
          const selectedVariant = selectedVariants[originalIndex];

          return (
            <div key={product._id || productIndex} className='product-card'>

              {/* Type badge (tree / flower / gift) */}
              {product.type && (
                <span className={`product-type-badge type-${product.type}`}>
                  {product.type === 'tree' ? 'Memorial Tree' : product.type === 'flower' ? 'Flowers' : 'Gift'}
                </span>
              )}

              {/* Wishlist Heart */}
              <div className='wishlist-badge'>
                <AddToWishList
                  id={product._id}
                  liked={product?.isLiked ?? false}
                  enabled={authenticated}
                  updateWishlist={updateWishlist}
                  authenticated={authenticated}
                />
              </div>

              {/* Product Image */}
              <Link to={this.getProductLink(product)} className='product-image-link'>
                <div className='product-image-wrapper'>
                  <img
                    className='product-image'
                    src={product.imageUrl || product.images?.[0]?.url || '/images/placeholder-image.png'}
                    alt={product.name}
                  />
                  <div className='product-image-overlay'>
                    <span className='view-text'>View Details</span>
                  </div>
                </div>
              </Link>

              {/* Product Info */}
              <div className='product-info'>
                <Link to={this.getProductLink(product)} className='product-name-link'>
                  <h3 className='product-name'>{product.name}</h3>
                </Link>

                {product.brand && Object.keys(product.brand).length > 0 && (
                  <p className='product-brand'>by {product.brand.name}</p>
                )}

                {/* Variant Selector */}
                {hasVariants && product.variants.length > 1 && (
                  <div className='variant-selector'>
                    <select
                      className='variant-select'
                      value={selectedVariant?.name || ''}
                      onChange={(e) => this.handleVariantChange(originalIndex, e.target.selectedIndex)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {product.variants.map((variant, variantIndex) => (
                        <option key={variantIndex} value={variant.name}>
                          {variant.name} — ${variant.price.toFixed(2)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Price */}
                <div className='product-price-wrapper'>
                  <span className='price-label'>From</span>
                  <span className='product-price'>
                    ${displayPrice ? displayPrice.toFixed(2) : '0.00'}
                  </span>
                </div>

                {/* Rating */}
                {product.totalReviews > 0 && (
                  <div className='product-rating'>
                    <span className='rating-star'>★</span>
                    <span className='rating-value'>{parseFloat(product?.averageRating).toFixed(1)}</span>
                    <span className='rating-count'>({product.totalReviews})</span>
                  </div>
                )}

                {/* Send Love Button */}
                <button
                  onClick={(e) => this.onSendLove(e, product, originalIndex)}
                  className='send-love-btn'
                  type='button'
                >
                  <Heart size={15} strokeWidth={2.5} />
                  Send Love
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

export default ProductList;
