/**
 * SearchBar.jsx — Live Keyword Search Input
 *
 * Filters the visible task list by title as the user types.
 * Filtering itself is done in App.jsx — this component only captures the input.
 *
 * Props:
 *   query    {string}   — current search string (controlled input)
 *   onChange {function} — called with the new string on every keystroke
 */

import React from 'react';
import PropTypes from 'prop-types';

function SearchBar({ query, onChange }) {
  return (
    <div className="search-bar">
      {/* Search icon (pure CSS/text, no external icon library needed) */}
      <span className="search-bar__icon" aria-hidden="true">⌕</span>
      <input
        id="task-search"
        type="text"
        className="search-bar__input"
        placeholder="Search tasks..."
        value={query}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search tasks by title"
      />
      {/* Show a clear button only when there is text */}
      {query && (
        <button
          className="search-bar__clear"
          onClick={() => onChange('')}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
}

SearchBar.propTypes = {
  query:    PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default SearchBar;
