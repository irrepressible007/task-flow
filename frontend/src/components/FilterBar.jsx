/**
 * FilterBar.jsx — Status Filter Tabs
 *
 * Three buttons to filter the task list by status: All, Pending, Completed.
 * The active filter is highlighted; clicking a button updates the filter in App.jsx.
 *
 * Props:
 *   filter         {string}   — current active filter: 'all' | 'pending' | 'completed'
 *   onFilterChange {function} — called with the new filter string on button click
 */

import React from 'react';
import PropTypes from 'prop-types';

// Filter options — label shown on the button and the value passed to the parent
const FILTERS = [
  { label: 'All',       value: 'all'       },
  { label: 'Pending',   value: 'pending'   },
  { label: 'Completed', value: 'completed' },
];

function FilterBar({ filter, onFilterChange }) {
  return (
    <div className="filter-bar" role="group" aria-label="Filter tasks by status">
      {FILTERS.map(({ label, value }) => (
        <button
          key={value}
          className={`filter-btn ${filter === value ? 'filter-btn--active' : ''}`}
          onClick={() => onFilterChange(value)}
          aria-pressed={filter === value}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

FilterBar.propTypes = {
  filter:         PropTypes.oneOf(['all', 'pending', 'completed']).isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterBar;
