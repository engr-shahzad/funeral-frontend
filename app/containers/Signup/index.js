/*
 *
 * Signup
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import actions from '../../actions';
import Input from '../../components/Common/Input';
import LoadingIndicator from '../../components/Common/LoadingIndicator';
import Checkbox from '../../components/Common/Checkbox';

class Signup extends React.PureComponent {
  render() {
    const {
      authenticated,
      signupFormData,
      formErrors,
      isLoading,
      isSubmitting,
      isSubscribed,
      signupChange,
      signUp,
      subscribeChange
    } = this.props;

    if (authenticated) return <Redirect to='/' />;

    const handleSubmit = event => {
      event.preventDefault();
      signUp();
    };

    return (
      <div style={styles.wrapper}>
        {isLoading && <LoadingIndicator />}
        <div style={styles.card}>

          {/* Logo / Header */}
          <div style={styles.header}>
            <div style={styles.logoCircle}>
              <i className='fa fa-user-plus' style={styles.logoIcon}></i>
            </div>
            <h2 style={styles.title}>Create Account</h2>
            <p style={styles.subtitle}>Join us today, it's free!</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate style={styles.form}>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>
              <Input
                type={'text'}
                error={formErrors['email']}
                name={'email'}
                placeholder={'Enter your email'}
                value={signupFormData.email}
                onInputChange={(name, value) => signupChange(name, value)}
              />
            </div>

            {/* First & Last Name side by side */}
            <div style={styles.row}>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>First Name</label>
                <Input
                  type={'text'}
                  error={formErrors['firstName']}
                  name={'firstName'}
                  placeholder={'First name'}
                  value={signupFormData.firstName}
                  onInputChange={(name, value) => signupChange(name, value)}
                />
              </div>
              <div style={{ ...styles.inputGroup, flex: 1 }}>
                <label style={styles.label}>Last Name</label>
                <Input
                  type={'text'}
                  error={formErrors['lastName']}
                  name={'lastName'}
                  placeholder={'Last name'}
                  value={signupFormData.lastName}
                  onInputChange={(name, value) => signupChange(name, value)}
                />
              </div>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <Input
                type={'password'}
                error={formErrors['password']}
                name={'password'}
                placeholder={'Create a password'}
                value={signupFormData.password}
                onInputChange={(name, value) => signupChange(name, value)}
              />
            </div>

            {/* Newsletter Checkbox */}
            <div style={styles.checkboxWrapper}>
              <Checkbox
                id={'subscribe'}
                label={'Subscribe to newsletter'}
                checked={isSubscribed}
                onChange={subscribeChange}
              />
            </div>

            {/* Signup Button */}
            <button
              type='submit'
              disabled={isSubmitting}
              style={{
                ...styles.signupBtn,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>

            {/* Divider */}
            <div style={styles.divider}>
              <span style={styles.dividerLine}></span>
              <span style={styles.dividerText}>Already have an account?</span>
              <span style={styles.dividerLine}></span>
            </div>

            {/* Back to Login */}
            <Link to={'/login'} style={styles.loginBtn}>
              Sign In
            </Link>

          </form>
        </div>
      </div>
    );
  }
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '20px',
    padding: '40px',
    width: '100%',
    maxWidth: '460px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoCircle: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px auto',
  },
  logoIcon: {
    color: 'white',
    fontSize: '28px',
  },
  title: {
    fontSize: '26px',
    fontWeight: '700',
    color: '#1a1a2e',
    margin: '0 0 6px 0',
  },
  subtitle: {
    fontSize: '14px',
    color: '#888',
    margin: 0,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  row: {
    display: 'flex',
    gap: '12px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#444',
  },
  checkboxWrapper: {
    marginTop: '-4px',
  },
  signupBtn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '4px',
    transition: 'opacity 0.2s',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '4px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    fontSize: '13px',
    color: '#aaa',
    whiteSpace: 'nowrap',
  },
  loginBtn: {
    width: '100%',
    padding: '13px',
    background: 'transparent',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
    display: 'block',
    boxSizing: 'border-box',
  },
};

const mapStateToProps = state => {
  return {
    authenticated: state.authentication.authenticated,
    signupFormData: state.signup.signupFormData,
    formErrors: state.signup.formErrors,
    isLoading: state.signup.isLoading,
    isSubmitting: state.signup.isSubmitting,
    isSubscribed: state.signup.isSubscribed
  };
};

export default connect(mapStateToProps, actions)(Signup);