// /**
//  * Admin Dashboard Route
//  * Protected route for admin users only
//  */

// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { Redirect } from 'react-router-dom';
// import AdminDashboard from '../Admin/AdminDashboard';

// class AdminRoute extends Component {
//   render() {
//     const { authenticated, user } = this.props;

//     // Check if user is authenticated
//     if (!authenticated) {
//       return <Redirect to="/login" />;
//     }

//     // Check if user has admin role
//     if (user && user.role !== 'Admin') {
//       return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100">
//           <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
//             <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
//             <p className="text-gray-700 mb-4">
//               You don't have permission to access the admin dashboard.
//             </p>
//             <p className="text-gray-600 mb-6">
//               Only users with Admin role can access this page.
//             </p>
//             <a
//               href="/dashboard"
//               className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//             >
//               Go to Dashboard
//             </a>
//           </div>
//         </div>
//       );
//     }

//     // User is authenticated and has admin role
//     return <AdminDashboard />;
//   }
// }

// const mapStateToProps = (state) => {
//   return {
//     authenticated: state.authentication.authenticated,
//     user: state.account.user
//   };
// };

// export default connect(mapStateToProps)(AdminRoute);

/**
 * Admin Dashboard Route
 * Direct access - No authentication required
 */

import React, { Component } from 'react';
import AdminDashboard from '../Admin/AdminDashboard';

class AdminRoute extends Component {
  render() {
    // Direct access to admin dashboard
    return <AdminDashboard />;
  }
}

export default AdminRoute;