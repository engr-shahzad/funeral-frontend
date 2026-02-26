/*
 *
 * Login
 *
 */

import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import actions from '../../actions';
import Input from '../../components/Common/Input';
import Button from '../../components/Common/Button';
import LoadingIndicator from '../../components/Common/LoadingIndicator';

class Login extends React.PureComponent {
  render() {
    const {
      authenticated,
      loginFormData,
      loginChange,
      login,
      formErrors,
      isLoading,
      isSubmitting
    } = this.props;

    if (authenticated) return <Redirect to='/' />;

    const registerLink = () => {
      this.props.history.push('/register');
    };

    const handleSubmit = event => {
      event.preventDefault();
      login();
    };

    return (
      <div style={styles.wrapper}>
        {isLoading && <LoadingIndicator />}
        <div style={styles.card}>

          {/* Logo / Header */}
          <div style={styles.header}>
            <div style={styles.logoCircle}>
              <i className='fa fa-user' style={styles.logoIcon}></i>
            </div>
            <h2 style={styles.title}>Welcome Back</h2>
            <p style={styles.subtitle}>Sign in to your account</p>
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
                value={loginFormData.email}
                onInputChange={(name, value) => loginChange(name, value)}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <Input
                type={'password'}
                error={formErrors['password']}
                name={'password'}
                placeholder={'Enter your password'}
                value={loginFormData.password}
                onInputChange={(name, value) => loginChange(name, value)}
              />
            </div>

            {/* Forgot Password */}
            <div style={styles.forgotWrapper}>
              <Link className='redirect-link' to={'/forgot-password'} style={styles.forgotLink}>
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type='submit'
              disabled={isSubmitting}
              style={{
                ...styles.loginBtn,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Divider */}
            <div style={styles.divider}>
              <span style={styles.dividerLine}></span>
              <span style={styles.dividerText}>New here?</span>
              <span style={styles.dividerLine}></span>
            </div>

            {/* Register */}
            <button
              type='button'
              onClick={registerLink}
              style={styles.registerBtn}
            >
              Create an Account
            </button>
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
    maxWidth: '420px',
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
  forgotWrapper: {
    textAlign: 'right',
    marginTop: '-8px',
  },
  forgotLink: {
    fontSize: '13px',
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '500',
  },
  loginBtn: {
    width: '100%',
    padding: '13px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    marginTop: '8px',
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
  registerBtn: {
    width: '100%',
    padding: '13px',
    background: 'transparent',
    color: '#667eea',
    border: '2px solid #667eea',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

const mapStateToProps = state => {
  return {
    authenticated: state.authentication.authenticated,
    loginFormData: state.login.loginFormData,
    formErrors: state.login.formErrors,
    isLoading: state.login.isLoading,
    isSubmitting: state.login.isSubmitting
  };
};

export default connect(mapStateToProps, actions)(Login);