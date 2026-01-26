import React from 'react';
import { 
    TrendingUp, 
    DollarSign, 
    ShoppingCart, 
    Users, 
    FileText,
    MessageSquare,
    Package,
    Activity
} from 'lucide-react';

const DashboardOverview = ({ stats }) => {
    const statCards = [
        {
            title: 'Total Revenue',
            value: `$${stats.totalRevenue?.toLocaleString() || 0}`,
            icon: DollarSign,
            color: 'bg-green-500',
            change: '+12.5%',
            changeType: 'positive'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders || 0,
            icon: ShoppingCart,
            color: 'bg-blue-500',
            change: '+8.2%',
            changeType: 'positive'
        },
        {
            title: 'Obituaries',
            value: stats.totalObituaries || 0,
            icon: FileText,
            color: 'bg-purple-500',
            change: `${stats.publishedObituaries || 0} published`,
            changeType: 'neutral'
        },
        {
            title: 'Products',
            value: stats.totalProducts || 0,
            icon: Package,
            color: 'bg-orange-500',
            change: 'Active inventory',
            changeType: 'neutral'
        },
        {
            title: 'Total Users',
            value: stats.totalUsers || 0,
            icon: Users,
            color: 'bg-indigo-500',
            change: '+5 new',
            changeType: 'positive'
        },
        {
            title: 'Condolences',
            value: stats.totalCondolences || 0,
            icon: MessageSquare,
            color: 'bg-pink-500',
            change: `${stats.recentOrders || 0} recent`,
            changeType: 'neutral'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-600 mb-1">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                    <p className={`text-sm mt-2 ${
                                        stat.changeType === 'positive' 
                                            ? 'text-green-600' 
                                            : 'text-gray-500'
                                    }`}>
                                        {stat.change}
                                    </p>
                                </div>
                                <div className={`${stat.color} p-4 rounded-full`}>
                                    <Icon className="text-white" size={24} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Recent Orders
                        </h3>
                        <Activity className="text-gray-400" size={20} />
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div
                                key={item}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div>
                                    <p className="font-medium text-gray-900">
                                        Order #100{item}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        2 items • $125.00
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                    Completed
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Top Products
                        </h3>
                        <TrendingUp className="text-gray-400" size={20} />
                    </div>
                    <div className="space-y-3">
                        {[
                            { name: 'Memorial Tree - Single', sales: 45 },
                            { name: 'Sympathy Flowers', sales: 38 },
                            { name: 'Memorial Grove (3 Trees)', sales: 28 },
                            { name: 'Remembrance Gift Set', sales: 22 },
                            { name: 'Memorial Tree - Grove of 5', sales: 18 }
                        ].map((product, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900">
                                        {product.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {product.sales} sales
                                    </p>
                                </div>
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${(product.sales / 45) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <FileText className="mx-auto mb-2 text-gray-600" size={24} />
                        <p className="text-sm font-medium text-gray-700">
                            Add Obituary
                        </p>
                    </button>
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <Package className="mx-auto mb-2 text-gray-600" size={24} />
                        <p className="text-sm font-medium text-gray-700">
                            Add Product
                        </p>
                    </button>
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <ShoppingCart className="mx-auto mb-2 text-gray-600" size={24} />
                        <p className="text-sm font-medium text-gray-700">
                            View Orders
                        </p>
                    </button>
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                        <Users className="mx-auto mb-2 text-gray-600" size={24} />
                        <p className="text-sm font-medium text-gray-700">
                            Manage Users
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;