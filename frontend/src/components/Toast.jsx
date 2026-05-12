/**
 * Toast.jsx — Toast Notification Component
 *
 * Displays a brief, non-blocking message at the bottom of the screen.
 * The parent (App.jsx) controls visibility by setting/clearing the `toast` state.
 * Type can be 'success', 'error', or 'info' — each gets a distinct color.
 *
 * Props:
 *   message {string} — the text to display
 *   type    {string} — 'success' | 'error' | 'info'  (default: 'success')
 */

import React from 'react';
import PropTypes from 'prop-types';

const ICONS = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
};

function Toast({ message, type = 'success' }) {
  return (
    <div className={`toast toast--${type}`} role="alert" aria-live="polite">
      <span className="toast__icon">{ICONS[type]}</span>
      <span className="toast__message">{message}</span>
    </div>
  );
}

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  type:    PropTypes.oneOf(['success', 'error', 'info']),
};

Toast.defaultProps = {
  type: 'success',
};

export default Toast;
