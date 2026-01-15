/**
 *
 * Navigation
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink as ActiveLink, withRouter } from 'react-router-dom';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/parse';
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';

import actions from '../../actions';
import logo from "../../../public/images/logo.png";
import "./Navigation.css";

import Button from '../../components/Common/Button';
import CartIcon from '../../components/Common/CartIcon';
import { BarsIcon } from '../../components/Common/Icon';
import Menu from '../NavigationMenu';
import Cart from '../Cart';

class Navigation extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isScrolled: false
    };
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    this.props.fetchStoreBrands();
    this.props.fetchStoreCategories();
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    if (window.scrollY > 50) {
      if (!this.state.isScrolled) {
        this.setState({ isScrolled: true });
      }
    } else {
      if (this.state.isScrolled) {
        this.setState({ isScrolled: false });
      }
    }
  }

  toggleBrand() {
    this.props.fetchStoreBrands();
    this.props.toggleBrand();
  }

  toggleMenu() {
    this.props.fetchStoreCategories();
    this.props.toggleMenu();
  }

  render() {
    const { isScrolled } = this.state;
    const {
      cartItems,
      isMenuOpen,
      isCartOpen,
      toggleCart,
      toggleMenu
    } = this.props;

    return (
      <header className={`header fixed-mobile-header ${isScrolled ? 'scrolled' : ''}`}>
         <div className="h-2" style={{ backgroundColor: '#1a2928' }}></div>
        {/* Top bar - Hidden on scroll */}
        {!isScrolled && (
          <div>
            <div className="h-2" style={{ backgroundColor: '#1a2928' }}></div>
            <div className='header-top-bar h-12 text-white'>
            
              <Container>
                <Row className='align-items-center'>
                  <Col md='6' className='text-left d-none d-md-block'>
                    <span className='top-bar-contact'>
                      <i className='fa fa-phone' style={{ marginRight: '8px' }} />
                      For Immediate Support: 1-605-787-3940
                    </span>
                  </Col>
                  <Col md='6' className='text-right d-none d-md-block'>
                    <div className='top-bar-icons'>
                      <a href='#' className='top-bar-icon' aria-label='Google'><i className='fa fa-google' /></a>
                      <a href='#' className='top-bar-icon' aria-label='Email'><i className='fa fa-envelope' /></a>
                      <a href='#' className='top-bar-icon' aria-label='Print'><i className='fa fa-print' /></a>
                      <a href='#' className='top-bar-icon' aria-label='Facebook'><i className='fa fa-facebook' /></a>
                    </div>
                  </Col>
                  <Col xs='12' className='text-center d-block d-md-none py-2'>
                    <i className='fa fa-phone' />
                    <span> For Support: 1-605-787-3940</span>
                  </Col>
                </Row>
              </Container>
            </div>
          </div>
        )}

        {/* Main navigation */}
        <div className='header-main-nav'>
          <Container>
            <Row className='align-items-center'>
              {/* Left Navigation */}
              <Col md='5' className='d-none d-md-block'>
                <Nav className='main-nav-left'>
                  <NavItem>
                    <NavLink tag={ActiveLink} to='/' exact activeClassName='active' className='nav-link-custom'>HOME</NavLink>
                  </NavItem>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret className='nav-link-custom'>OBITUARIES</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem tag={Link} to='/listings'>All Obituaries</DropdownItem>
                      <DropdownItem tag={Link} to='/obituary-writer'>Obituary Writer</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret className='nav-link-custom'>ABOUT US</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem tag={Link} to='/about-us'>About Us</DropdownItem>
                      <DropdownItem tag={Link} to='/our-staff'>Our Staff</DropdownItem>
                      <DropdownItem tag={Link} to='/contact-us'>Contact Us</DropdownItem>
                      <DropdownItem tag={Link} to='/why-choose-us'>Why Choose Us</DropdownItem>
                      <DropdownItem tag={Link} to='/testimonials'>Testimonials</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Nav>
              </Col>

              {/* Center Logo */}
              <Col xs='12' md='2' className='text-center'>
                <Link to='/' className='center-logo-link'>
                  <img src={logo} alt='WEST River' className='center-logo-img' />
                </Link>
              </Col>

              {/* Right Navigation */}
              <Col md='5' className='d-none d-md-block'>
                <Nav className='main-nav-right'>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret className='nav-link-custom'>SERVICES</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem tag={Link} to='/our-services'>Our Services</DropdownItem>
                      <DropdownItem divider />
                      <UncontrolledDropdown nav={false} inNavbar className='dropdown-submenu'>
                        <DropdownToggle tag='span' className='dropdown-item dropdown-toggle'>Pre Plan</DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem tag={Link} to='/pre-arrangements'>Pre-Plan</DropdownItem>
                          <DropdownItem tag={Link} to='/prearrangements-form'>Pre Arrangements Form</DropdownItem>
                          <DropdownItem tag={Link} to='/have-the-talk-of-a-lifetime'>Have the Talk of Life</DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                  <NavItem>
                    <NavLink tag={ActiveLink} to='/location' activeClassName='active' className='nav-link-custom'>LOCATION</NavLink>
                  </NavItem>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret className='nav-link-custom'>RESOURCES</DropdownToggle>
                    <DropdownMenu>
                      <DropdownItem tag={Link} to='/when-death-occurs'>When Death Occurs</DropdownItem>
                      <DropdownItem tag={Link} to='/grief-support'>Grief Support</DropdownItem>
                      <DropdownItem tag={Link} to='/funeral-etiquette'>Funeral Etiquette</DropdownItem>
                      <DropdownItem tag={Link} to='/social-security'>Social Security Benefits</DropdownItem>
                      <DropdownItem divider />
                      <UncontrolledDropdown nav={false} inNavbar className='dropdown-submenu submenu-left'>
                        <DropdownToggle tag='span' className='dropdown-item dropdown-toggle'>Veterans</DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem tag={Link} to='/veterans'>Veterans Overview</DropdownItem>
                          <DropdownItem tag={Link} to='/veterans-headstones'>Veterans Headstones</DropdownItem>
                          <DropdownItem tag={Link} to='/veterans-burial-flags'>Veterans Burial Flags</DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                      <DropdownItem divider />
                      <DropdownItem tag={Link} to='/faqs'>FAQs</DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </Nav>
              </Col>
            </Row>
          </Container>
        </div>
         {!isScrolled && (
          <div style={{ backgroundColor: 'white', height: '2px' }}></div>
         )
  }
        

        {/* Mobile Navigation */}
        <div className='mobile-nav d-block d-md-none'>
          <Container>
            <Row className='align-items-center py-2'>
              <Col xs='3'>
                <Button borderless variant='empty' icon={<BarsIcon />} onClick={() => this.toggleMenu()} />
              </Col>
              <Col xs='6' className='text-center'></Col>
              <Col xs='3' className='text-right'>
                <CartIcon cartItems={cartItems} onClick={toggleCart} />
              </Col>
            </Row>
          </Container>
        </div>

        {/* Hidden drawers */}
        <div className={isCartOpen ? 'mini-cart-open' : 'hidden-mini-cart'}>
          <div className='mini-cart'><Cart /></div>
          <div className={isCartOpen ? 'drawer-backdrop dark-overflow' : 'drawer-backdrop'} onClick={toggleCart} />
        </div>
        <div className={isMenuOpen ? 'mini-menu-open' : 'hidden-mini-menu'}>
          <div className='mini-menu'><Menu /></div>
          <div className={isMenuOpen ? 'drawer-backdrop dark-overflow' : 'drawer-backdrop'} onClick={toggleMenu} />
        </div>
      </header>
    );
  }
}

const mapStateToProps = state => ({
  isMenuOpen: state.navigation.isMenuOpen,
  isCartOpen: state.navigation.isCartOpen,
  cartItems: state.cart.cartItems
});

export default connect(mapStateToProps, actions)(withRouter(Navigation));