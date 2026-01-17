import React, { Component } from 'react';
import './ObituaryList.css';

class ObituaryList extends Component {
    formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    renderLoading = () => {
        return (
            <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading obituaries...</p>
            </div>
        );
    };

    renderEmptyState = () => {
        return (
            <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No Obituaries Yet</h3>
                <p>Get started by adding your first obituary</p>
                <button className="btn-add-large" onClick={this.props.onAdd}>
                    ➕ Add New Obituary
                </button>
            </div>
        );
    };

    renderTable = () => {
        const { obituaries, onEdit, onDelete } = this.props;

        return (
            <div className="table-wrapper">
                <table className="obituary-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Birth Date</th>
                            <th>Deceased Date</th>
                            <th>Location</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {obituaries.map(obit => (
                            <tr key={obit._id}>
                                <td className="name-cell">
                                    <strong>
                                        {obit.firstName} {obit.middleName} {obit.lastName}
                                    </strong>
                                    {obit.maidenName && (
                                        <span className="maiden-name">(née {obit.maidenName})</span>
                                    )}
                                </td>
                                <td>{this.formatDate(obit.birthDate)}</td>
                                <td>{this.formatDate(obit.deceasedDate)}</td>
                                <td>{obit.townCityOfResidence || 'N/A'}</td>
                                <td>
                                    <span className={`status-badge ${obit.isPublished ? 'published' : 'draft'}`}>
                                        {obit.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="action-cell">
                                    <button 
                                        className="btn-action btn-edit"
                                        onClick={() => onEdit(obit)}
                                        title="Edit"
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button 
                                        className="btn-action btn-delete"
                                        onClick={() => onDelete(obit._id, `${obit.firstName} ${obit.lastName}`)}
                                        title="Delete"
                                    >
                                        🗑️ Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    render() {
        const { obituaries, loading, onAdd } = this.props;

        return (
            <div className="obituary-list-container">
                <div className="list-header">
                    <div className="header-content">
                        <h1>Obituary Management</h1>
              
                    </div>
                    <button className="btn-add" onClick={onAdd}>
                        ➕ Add New Obituary
                    </button>
                </div>

                <div className="list-content">
                    {loading ? this.renderLoading() :
                     obituaries.length === 0 ? this.renderEmptyState() :
                     this.renderTable()}
                </div>

                <div className="list-footer">
                    <p>Total: {obituaries.length} obituaries</p>
                </div>
            </div>
        );
    }
}

export default ObituaryList;