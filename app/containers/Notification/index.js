/**
 * Notification — Beautiful memorial-themed toasts
 */

import React from 'react';
import { connect } from 'react-redux';
import Notifications from 'react-notification-system-redux';
import actions from '../../actions';

const BASE = {
  margin:           '0 0 10px 0',
  padding:          '14px 18px 14px 16px',
  borderRadius:     '14px',
  border:           'none',
  borderLeft:       'none',
  boxShadow:        '0 8px 28px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)',
  fontFamily:       "'Georgia', 'Segoe UI', serif",
  fontSize:         '14px',
  lineHeight:       '1.5',
  cursor:           'default',
  width:            '320px',
  minHeight:        'unset',
  maxHeight:        'unset',
  opacity:          1,
  WebkitTransition: 'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
  transition:       'all 0.3s cubic-bezier(0.23, 1, 0.32, 1)',
  overflow:         'hidden',
};

const toastStyle = {
  // ── Containers ──────────────────────────────────────────────
  Containers: {
    DefaultStyle: {
      zIndex:   9999,
      padding:  '0 16px',
      position: 'fixed',
    },
    tr: {
      top:   '80px',
      right: '16px',
    },
  },

  // ── Notification item ────────────────────────────────────────
  NotificationItem: {
    DefaultStyle: {
      ...BASE,
      background:  '#2c1810',
      color:       '#fff',
    },

    success: {
      ...BASE,
      background:   'linear-gradient(135deg, #1a3d2f 0%, #2d6a4f 100%)',
      color:        '#fff',
      borderLeft:   '4px solid #52b788',
      borderRadius: '0 14px 14px 0',
    },

    error: {
      ...BASE,
      background:   'linear-gradient(135deg, #6b1a28 0%, #8b3a52 100%)',
      color:        '#fff',
      borderLeft:   '4px solid #e07070',
      borderRadius: '0 14px 14px 0',
    },

    warning: {
      ...BASE,
      background:   'linear-gradient(135deg, #7a5200 0%, #b07830 100%)',
      color:        '#fff',
      borderLeft:   '4px solid #f5c842',
      borderRadius: '0 14px 14px 0',
    },

    info: {
      ...BASE,
      background:   'linear-gradient(135deg, #1e3a5f 0%, #2d5a8e 100%)',
      color:        '#fff',
      borderLeft:   '4px solid #74a8e0',
      borderRadius: '0 14px 14px 0',
    },
  },

  // ── Title ───────────────────────────────────────────────────
  Title: {
    DefaultStyle: {
      fontFamily:   "'Georgia', serif",
      fontWeight:   '700',
      fontSize:     '14px',
      margin:       '0 0 4px 0',
      padding:      '0',
      color:        '#fff',
      lineHeight:   '1.35',
    },
    success: { color: '#d4f5e2' },
    error:   { color: '#ffd4d4' },
    warning: { color: '#fff0c0' },
    info:    { color: '#d4e8ff' },
  },

  // ── Message ──────────────────────────────────────────────────
  MessageWrapper: {
    DefaultStyle: {
      margin:   '0',
      padding:  '0',
      fontSize: '13px',
      color:    'rgba(255,255,255,0.82)',
      lineHeight: '1.5',
    },
  },

  // ── Dismiss (×) button ───────────────────────────────────────
  Dismiss: {
    DefaultStyle: {
      fontFamily:  'sans-serif',
      fontSize:    '16px',
      fontWeight:  '400',
      lineHeight:  '1',
      width:       '22px',
      height:      '22px',
      borderRadius:'50%',
      top:         '10px',
      right:       '10px',
      background:  'rgba(255,255,255,0.15)',
      color:       'rgba(255,255,255,0.80)',
      cursor:      'pointer',
    },
    success: { background: 'rgba(82,183,136,0.25)', color: '#d4f5e2' },
    error:   { background: 'rgba(224,112,112,0.25)', color: '#ffd4d4' },
    warning: { background: 'rgba(245,200,66,0.20)',  color: '#fff0c0' },
    info:    { background: 'rgba(116,168,224,0.25)', color: '#d4e8ff' },
  },
};

class Notification extends React.PureComponent {
  render() {
    const { notifications } = this.props;
    return <Notifications notifications={notifications} style={toastStyle} />;
  }
}

const mapStateToProps = state => ({
  notifications: state.notifications
});

export default connect(mapStateToProps, actions)(Notification);
