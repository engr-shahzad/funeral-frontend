/**
 *
 * ProductList - Memorial Style Product Cards with Variants
 *
 */

import React from 'react';
import { Link } from 'react-router-dom';
import AddToWishList from '../AddToWishList';
import "./Productlist.css"
class ProductList extends React.Component {
  constructor(props) {
    super(props);
    
    // Initialize selected variants for each product
    const initialVariants = {};
    props.products.forEach((product, index) => {
      // Find default variant or use first variant
      const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];
      initialVariants[index] = defaultVariant;
    });
    
    this.state = {
      selectedVariants: initialVariants
    };
  }

  componentDidUpdate(prevProps) {
    // Update variants if products change
    if (prevProps.products !== this.props.products) {
      const initialVariants = {};
      this.props.products.forEach((product, index) => {
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
      selectedVariants: {
        ...prevState.selectedVariants,
        [productIndex]: selectedVariant
      }
    }));
  }

  getProductPrice = (product, productIndex) => {
    const { selectedVariants } = this.state;
    
    // Check if product has variants
    if (product.variants && product.variants.length > 0) {
      const selectedVariant = selectedVariants[productIndex];
      return selectedVariant?.price || product.variants[0].price;
    }
    
    // Fallback to direct price
    return product.price;
  }

  onAddToCart = (e, product, productIndex) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();

    const { handleAddToCart } = this.props;
    const { selectedVariants } = this.state;

    console.log('🛒 ProductList - Adding to cart:', product);

    if (handleAddToCart) {
      const selectedVariant = selectedVariants[productIndex];
      
      // Add selected variant and quantity to product
      const productWithVariant = {
        ...product,
        selectedVariant: selectedVariant,
        price: selectedVariant?.price || product.price,
        variant: selectedVariant?.name,
        quantity: 1
      };

      handleAddToCart(productWithVariant);
    } else {
      console.warn('⚠️ handleAddToCart prop not provided to ProductList');
    }
  }

  render() {
    const { products, updateWishlist, authenticated } = this.props;
    const { selectedVariants } = this.state;

    // Reverse the products array to show newest first (last in DB becomes first)
    const reversedProducts = [...products].reverse();

    return (
      <div className='products-grid'>
        {reversedProducts.map((product, productIndex) => {
          // Use original index for variant selection
          const originalIndex = products.length - 1 - productIndex;
          const displayPrice = this.getProductPrice(product, originalIndex);
          const hasVariants = product.variants && product.variants.length > 0;
          const selectedVariant = selectedVariants[originalIndex];

          return (
            <div key={product._id || productIndex} className='product-card'>
              {/* Wishlist Heart - Top Right */}
              <div className='wishlist-badge'>
                <AddToWishList
                  id={product._id}
                  liked={product?.isLiked ?? false}
                  enabled={authenticated}
                  updateWishlist={updateWishlist}
                  authenticated={authenticated}
                />
              </div>

              {/* Product Image - Clickable */}
              <Link
                to={`/product/${product.slug || product._id}`}
                className='product-image-link'
              >
                <div className='product-image-wrapper'>
                  <img
                    className='product-image'
                    src={
                      product.imageUrl ||
                      product.images?.[0]?.url ||
                      '/images/placeholder-image.png'
                    }
                    alt={product.name}
                  />
                </div>
              </Link>

              {/* Product Info */}
              <div className='product-info'>
                <Link
                  to={`/product/${product.slug || product._id}`}
                  className='product-name-link'
                >
                  <h3 className='product-name'>{product.name}</h3>
                </Link>

                {/* Brand (if exists) */}
                {product.brand && Object.keys(product.brand).length > 0 && (
                  <p className='product-brand'>By {product.brand.name}</p>
                )}

                {/* Variant Selector (if variants exist) */}
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
                          {variant.name} - ${variant.price.toFixed(2)}
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

                {/* Rating (if exists) */}
                {product.totalReviews > 0 && (
                  <div className='product-rating'>
                    <span className='rating-value'>
                      {parseFloat(product?.averageRating).toFixed(1)}
                    </span>
                    <span className='rating-star'>★</span>
                    <span className='rating-count'>({product.totalReviews})</span>
                  </div>
                )}

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => this.onAddToCart(e, product, originalIndex)}
                  className='add-to-cart-btn'
                  type='button'
                >
                  Add to Cart
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