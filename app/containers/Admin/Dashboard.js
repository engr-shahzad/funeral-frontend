/**
 * Admin Dashboard
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_URL } from '../../constants';

const Dashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    obituaries: 0,
    users: 0,
    orders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentObituaries, setRecentObituaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch stats in parallel
      const [productsRes, obituariesRes, usersRes, ordersRes] = await Promise.all([
        axios.get(`${API_URL}/product`).catch(() => ({ data: { products: [] } })),
        axios.get(`${API_URL}/obituaries`).catch(() => ({ data: { obituaries: [] } })),
        axios.get(`${API_URL}/user`).catch(() => ({ data: { users: [] } })),
        axios.get(`${API_URL}/order`, { params: { page: 1, limit: 5 } }).catch(() => ({ data: { orders: [], count: 0 } }))
      ]);

      setStats({
        products: productsRes.data?.products?.length || 0,
        obituaries: obituariesRes.data?.obituaries?.length || 0,
        users: usersRes.data?.users?.length || 0,
        orders: ordersRes.data?.count || ordersRes.data?.orders?.length || 0
      });

      setRecentOrders(ordersRes.data?.orders?.slice(0, 5) || []);
      setRecentObituaries(obituariesRes.data?.obituaries?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner" />
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <Link to="/admin/products" className="stat-card">
          <div className="stat-icon blue">
            <i className="icon-basket" />
          </div>
          <div className="stat-info">
            <h3>{stats.products}</h3>
            <p>Products</p>
          </div>
        </Link>

        <Link to="/admin/obituaries" className="stat-card">
          <div className="stat-icon green">
            <i className="icon-book-open" />
          </div>
          <div className="stat-info">
            <h3>{stats.obituaries}</h3>
            <p>Obituaries</p>
          </div>
        </Link>

        <Link to="/admin/users" className="stat-card">
          <div className="stat-icon orange">
            <i className="icon-people" />
          </div>
          <div className="stat-info">
            <h3>{stats.users}</h3>
            <p>Users</p>
          </div>
        </Link>

        <Link to="/admin/orders" className="stat-card">
          <div className="stat-icon red">
            <i className="icon-bag" />
          </div>
          <div className="stat-info">
            <h3>{stats.orders}</h3>
            <p>Orders</p>
          </div>
        </Link>
      </div>

      {/* Recent Activity Grid */}
      <div className="dashboard-grid">
        {/* Recent Orders */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Recent Orders</h3>
            <Link to="/admin/orders" className="btn-admin btn-sm btn-secondary">View All</Link>
          </div>
          <div className="recent-list">
            {recentOrders.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '14px' }}>No orders yet</p>
            ) : (
              recentOrders.map(order => (
                <div key={order._id} className="recent-item">
                  <div className="item-info">
                    <h4>Order #{order._id.slice(-8)}</h4>
                    <p>{formatDate(order.created)}</p>
                  </div>
                  <div>
                    <span className={`status-badge ${order.paymentStatus === 'succeeded' ? 'success' : order.paymentStatus === 'pending' ? 'warning' : 'danger'}`}>
                      {order.paymentStatus}
                    </span>
                    <span style={{ marginLeft: '10px', fontWeight: '600' }}>{formatCurrency(order.total)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Obituaries */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '16px' }}>Recent Obituaries</h3>
            <Link to="/admin/obituaries" className="btn-admin btn-sm btn-secondary">View All</Link>
          </div>
          <div className="recent-list">
            {recentObituaries.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '14px' }}>No obituaries yet</p>
            ) : (
              recentObituaries.map(obituary => (
                <div key={obituary._id} className="recent-item">
                  <div className="item-info">
                    <h4>{obituary.firstName} {obituary.lastName}</h4>
                    <p>{obituary.location || 'Unknown location'}</p>
                  </div>
                  <span className={`status-badge ${obituary.isPublished ? 'success' : 'neutral'}`}>
                    {obituary.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
