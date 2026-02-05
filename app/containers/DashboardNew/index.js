import React, { Component } from 'react';
import ObituaryList from './ObituaryList';
import New from './NewForm';
import './Dashboard.css';

class DashboardNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            obituaries: [],
            loading: true,
            showForm: false,
            editingObituary: null,
            toast: {
                show: false,
                message: '',
                type: 'success'
            }
        };

        this.API_BASE_URL = 'https://funeralbackend.onrender.com/api/obituaries';
    }

    componentDidMount() {
        this.loadObituaries();
    }

    // Load all obituaries
    loadObituaries = async () => {
        try {
            this.setState({ loading: true });
            const response = await fetch(this.API_BASE_URL);
            const data = await response.json();
            
            this.setState({
                obituaries: data.obituaries || [],
                loading: false
            });
        } catch (error) {
            console.error('Error loading obituaries:', error);
            this.showToast('Failed to load obituaries', 'error');
            this.setState({ loading: false });
        }
    };

    // Show Add Form
    handleAdd = () => {
        this.setState({
            showForm: true,
            editingObituary: null
        });
    };

    // Show Edit Form
    handleEdit = (obituary) => {
        this.setState({
            showForm: true,
            editingObituary: obituary
        });
    };

    // Delete Obituary
    handleDelete = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete the obituary for ${name}?`)) {
            return;
        }

        try {
            const response = await fetch(`${this.API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete obituary');
            }

            this.showToast('Obituary deleted successfully', 'success');
            this.loadObituaries();
        } catch (error) {
            console.error('Error deleting obituary:', error);
            this.showToast('Failed to delete obituary', 'error');
        }
    };

    // Close Form
    handleCloseForm = () => {
        this.setState({
            showForm: false,
            editingObituary: null
        });
    };

    // Save Obituary (Create or Update)
    handleSave = async (formData) => {
        try {
            const { editingObituary } = this.state;
            const url = editingObituary 
                ? `${this.API_BASE_URL}/${editingObituary._id}` 
                : this.API_BASE_URL;
            const method = editingObituary ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formData
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to save obituary');
            }

            const message = editingObituary 
                ? 'Obituary updated successfully!' 
                : 'Obituary created successfully!';
            
            this.showToast(message, 'success');
            this.handleCloseForm();
            this.loadObituaries();

            return true;
        } catch (error) {
            console.error('Error saving obituary:', error);
            this.showToast(error.message || 'Failed to save obituary', 'error');
            return false;
        }
    };

    // Show Toast Notification
    showToast = (message, type = 'success') => {
        this.setState({
            toast: { show: true, message, type }
        });

        setTimeout(() => {
            this.setState({
                toast: { show: false, message: '', type: 'success' }
            });
        }, 3000);
    };

    render() {
        const { obituaries, loading, showForm, editingObituary, toast } = this.state;

        return (
            <div className="dashboard">
                {!showForm ? (
                    <ObituaryList
                        obituaries={obituaries}
                        loading={loading}
                        onAdd={this.handleAdd}
                        onEdit={this.handleEdit}
                        onDelete={this.handleDelete}
                    />
                ) : (
                    <New
                        obituary={editingObituary}
                        onSave={this.handleSave}
                        onCancel={this.handleCloseForm}
                    />
                )}

                {/* Toast Notification */}
                {toast.show && (
                    <div className={`toast toast-${toast.type}`}>
                        <span>{toast.message}</span>
                    </div>
                )}
            </div>
        );
    }
}

export default DashboardNew;