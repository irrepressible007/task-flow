/**
 * ConfirmModal.jsx — Confirmation Dialog
 *
 * A styled modal that asks the user to confirm a destructive action (e.g. delete).
 * Replaces the browser's native confirm() dialog with a polished UI component.
 *
 * Props:
 *   message   {string}   — The question to ask the user
 *   onConfirm {function} — Called when the user clicks "Delete"
 *   onCancel  {function} — Called when the user clicks "Cancel" or the backdrop
 */

import React from 'react';
import PropTypes from 'prop-types';

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    /* Clicking the dark backdrop also cancels the action */
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="modal-box confirm-modal"
        onClick={(e) => e.stopPropagation()} /* prevent backdrop click from firing */
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        {/* Warning icon */}
        <div className="confirm-modal__icon">⚠</div>

        <h2 id="confirm-title" className="confirm-modal__title">Are you sure?</h2>
        <p className="confirm-modal__message">{message}</p>

        <div className="confirm-modal__actions">
          <button className="btn btn-ghost" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

ConfirmModal.propTypes = {
  message:   PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel:  PropTypes.func.isRequired,
};

export default ConfirmModal;
