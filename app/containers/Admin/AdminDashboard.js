import React, { useState, useEffect } from 'react';
import { 
    LayoutDashboard, 
    Users, 
    ShoppingCart, 
    Package, 
    MessageSquare, 
    FileText,
    Menu,
    X,
    Bell,
    Settings,
    LogOut
} from 'lucide-react';

// Import admin components
import ObituariesAdmin from './ObituariesAdmin';
import OrdersAdmin from './OrdersAdmin';
import ProductsAdmin from './ProductsAdmin';
import CondolencesAdmin from './CondolencesAdmin';
import UsersAdmin from './UsersAdmin';
import DashboardOverview from './DashboardOverview';
import "./AdminDashboard.css"

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [stats, setStats] = useState({
        totalObituaries: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalCondolences: 0,
        totalUsers: 0,
        totalRevenue: 0,
        recentOrders: 0,
        publishedObituaries: 0
    });

    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/';

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    const fetchDashboardStats = async () => {
        try {
            const response = await fetch(`${API_URL}api/admin/stats`);
            if (response.ok) {
                const data = await response.json();
                setStats(data);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'blue' },
        { id: 'obituaries', label: 'Obituaries', icon: FileText, color: 'purple' },
        { id: 'orders', label: 'Orders', icon: ShoppingCart, color: 'green' },
        { id: 'products', label: 'Products', icon: Package, color: 'orange' },
        { id: 'condolences', label: 'Condolences', icon: MessageSquare, color: 'pink' },
        { id: 'users', label: 'Users', icon: Users, color: 'indigo' }
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardOverview stats={stats} />;
            case 'obituaries':
                return <ObituariesAdmin />;
            case 'orders':
                return <OrdersAdmin />;
            case 'products':
                return <ProductsAdmin />;
            case 'condolences':
                return <CondolencesAdmin />;
            case 'users':
                return <UsersAdmin />;
            default:
                return <DashboardOverview stats={stats} />;
        }
    };

    const styles = {
        container: {
            display: 'flex',
            minHeight: '100vh',
            backgroundColor: '#f3f4f6',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        },
        sidebar: {
            width: sidebarOpen ? '256px' : '80px',
            backgroundColor: '#1f2937',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            transition: 'width 0.3s ease',
            position: 'relative',
            boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
        },
        sidebarHeader: {
            padding: '20px',
            borderBottom: '1px solid #374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        logo: {
            fontSize: '20px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            whiteSpace: 'nowrap'
        },
        menuButton: {
            padding: '8px',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
        },
        nav: {
            flex: 1,
            padding: '20px 16px',
            overflowY: 'auto'
        },
        navItem: (isActive) => ({
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px 16px',
            marginBottom: '8px',
            borderRadius: '8px',
            backgroundColor: isActive ? '#3b82f6' : 'transparent',
            color: isActive ? 'white' : '#d1d5db',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontSize: '15px',
            fontWeight: '500',
            textAlign: 'left'
        }),
        mainContent: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            overflow: 'hidden'
        },
        topBar: {
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '16px 24px',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        topBarTitle: {
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#111827'
        },
        topBarRight: {
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
        },
        iconButton: {
            padding: '8px',
            borderRadius: '8px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#6b7280',
            cursor: 'pointer',
            transition: 'all 0.2s'
        },
        avatar: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: '#3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px'
        },
        contentArea: {
            flex: 1,
            padding: '24px',
            overflowY: 'auto'
        }
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <aside style={styles.sidebar}>
                {/* Header */}
                <div style={styles.sidebarHeader}>
                    {sidebarOpen && (
                        <h1 style={styles.logo}>Admin Panel</h1>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        style={styles.menuButton}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav style={styles.nav}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                style={styles.navItem(isActive)}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.target.style.backgroundColor = '#374151';
                                        e.target.style.color = 'white';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.target.style.backgroundColor = 'transparent';
                                        e.target.style.color = '#d1d5db';
                                    }
                                }}
                            >
                                <Icon size={20} />
                                {sidebarOpen && (
                                    <span>{item.label}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div style={{ padding: '16px', borderTop: '1px solid #374151' }}>
                    {sidebarOpen && (
                        <div style={{ fontSize: '14px', color: '#9ca3af' }}>
                            <p>Admin Dashboard</p>
                            <p style={{ fontSize: '12px', marginTop: '4px' }}>v1.0.0</p>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main style={styles.mainContent}>
                {/* Top Bar */}
                <header style={styles.topBar}>
                    <h2 style={styles.topBarTitle}>
                        {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                    </h2>
                    <div style={styles.topBarRight}>
                        <button
                            style={styles.iconButton}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f3f4f6';
                                e.target.style.color = '#111827';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#6b7280';
                            }}
                        >
                            <Bell size={20} />
                        </button>
                        <button
                            style={styles.iconButton}
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = '#f3f4f6';
                                e.target.style.color = '#111827';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                                e.target.style.color = '#6b7280';
                            }}
                        >
                            <Settings size={20} />
                        </button>
                        <div style={styles.avatar}>A</div>
                    </div>
                </header>

                {/* Content Area */}
                <div style={styles.contentArea}>
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;