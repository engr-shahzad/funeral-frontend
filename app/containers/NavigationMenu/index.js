/**
 * NavigationMenu.js
 */
import React from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Container } from 'reactstrap';

import actions from '../../actions';
import Button from '../../components/Common/Button';
import { CloseIcon } from '../../components/Common/Icon';

class NavigationMenu extends React.PureComponent {
  render() {
    const { isMenuOpen, toggleMenu } = this.props;

    const handleLinkClick = () => {
      this.props.toggleMenu();
    };

    return (
      <div className='navigation-menu'>
        <div className='menu-header text-right p-3'>
          {isMenuOpen && (
            <Button
              borderless
              variant='empty'
              ariaLabel='close the menu'
              icon={<CloseIcon />}
              onClick={toggleMenu}
            />
          )}
        </div>
        <div className='menu-body'>
          <Container>
            <nav role='navigation'>
              <ul className='menu-list'>
                {/* Main Links */}
                <li className='menu-item'>
                  <NavLink onClick={handleLinkClick} to='/' exact activeClassName='active-link'>HOME</NavLink>
                </li>

                {/* Obituaries Section */}
                <li className='menu-item-group'>
                  <span className='menu-group-title'>OBITUARIES</span>
                  <ul className='menu-sub-list'>
                    <li><NavLink onClick={handleLinkClick} to='/obituaries'>All Obituaries</NavLink></li>
                    <li><NavLink onClick={handleLinkClick} to='/obituary-writer'>Obituary Writer</NavLink></li>
                  </ul>
                </li>

                {/* About Us Section */}
                <li className='menu-item-group'>
                  <span className='menu-group-title'>ABOUT US</span>
                  <ul className='menu-sub-list'>
                    <li><NavLink onClick={handleLinkClick} to='/about-us'>About Us</NavLink></li>
                    <li><NavLink onClick={handleLinkClick} to='/our-staff'>Our Staff</NavLink></li>
                    <li><NavLink onClick={handleLinkClick} to='/contact-us'>Contact Us</NavLink></li>
                  </ul>
                </li>

                {/* Services Section */}
                <li className='menu-item-group'>
                  <span className='menu-group-title'>SERVICES</span>
                  <ul className='menu-sub-list'>
                    <li><NavLink onClick={handleLinkClick} to='/our-services'>Our Services</NavLink></li>
                    <li><NavLink onClick={handleLinkClick} to='/pre-arrangements'>Pre-Plan</NavLink></li>
                  </ul>
                </li>

                <li className='menu-item'>
                  <NavLink onClick={handleLinkClick} to='/location' activeClassName='active-link'>LOCATION</NavLink>
                </li>

                <li className='menu-item'>
                  <NavLink onClick={handleLinkClick} to='/faqs' activeClassName='active-link'>FAQs</NavLink>
                </li>
              </ul>
            </nav>
          </Container>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isMenuOpen: state.navigation.isMenuOpen,
    categories: state.category.storeCategories
  };
};

export default connect(mapStateToProps, actions)(NavigationMenu);