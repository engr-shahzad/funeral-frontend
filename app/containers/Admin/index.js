/**
 * Admin Panel - Main Entry
 */

import React, { useState } from 'react';
import { Switch, Route, NavLink, useLocation } from 'react-router-dom';

import ProductsAdmin from './Products';
import ObituariesAdmin from './Obituaries';
import CondolencesAdmin from './Condolences';
import UsersAdmin from './Users';
import OrdersAdmin from './Orders';
import Dashboard from './Dashboard';
import HomepageSettingsAdmin from './Homepagesettings';
import BlogsAdmin from './Blogs';
import PageSettingsAdmin from './PageSettings';
import SiteConfigAdmin from './SiteConfig';
import RedirectsAdmin from './Redirects';

import './styles.scss';

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: 'icon-speedometer', exact: true },
    { path: '/admin/homepage', label: 'Homepage', icon: 'icon-home' },
    { path: '/admin/blogs', label: 'Blogs', icon: 'icon-pencil' },
    { path: '/admin/products', label: 'Products', icon: 'icon-basket' },
    { path: '/admin/obituaries', label: 'Obituaries', icon: 'icon-book-open' },
    { path: '/admin/condolences', label: 'Condolences', icon: 'icon-heart' },
    { path: '/admin/users', label: 'Users', icon: 'icon-people' },
    { path: '/admin/orders', label: 'Orders', icon: 'icon-bag' },
    { path: '/admin/page-settings', label: 'Page Settings', icon: 'icon-settings' },
    { path: '/admin/site-config', label: 'Site Config', icon: 'icon-globe' },
    { path: '/admin/redirects', label: 'Redirects', icon: 'icon-arrow-right-circle' }
  ];

  return (
    <div className={`admin-panel ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>WestRiverFd Admin</h2>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className={`faW fa-${sidebarOpen ? 'chevron-left' : 'chevron-right'}`} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              exact={item.exact}
              className="nav-item"
              activeClassName="active"
            >
              <i className={item.icon} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <NavLink to="/" className="nav-item">
            <i className="icon-arrow-left" />
            <span>Back to Site</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-content">
        <Switch>
          <Route exact path="/admin" component={Dashboard} />
          <Route path="/admin/homepage" component={HomepageSettingsAdmin} />
          <Route path="/admin/blogs" component={BlogsAdmin} />
          <Route path="/admin/products" component={ProductsAdmin} />
          <Route path="/admin/obituaries" component={ObituariesAdmin} />
          <Route path="/admin/condolences" component={CondolencesAdmin} />
          <Route path="/admin/users" component={UsersAdmin} />
          <Route path="/admin/orders" component={OrdersAdmin} />
          <Route path="/admin/page-settings" component={PageSettingsAdmin} />
          <Route path="/admin/site-config" component={SiteConfigAdmin} />
          <Route path="/admin/redirects" component={RedirectsAdmin} />
        </Switch>
      </main>
    </div>
  );
};

export default Admin;
