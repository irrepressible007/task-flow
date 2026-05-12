/**
 * StatsCard.jsx — Task Statistics Summary
 *
 * Displays a top-of-page summary row showing Total, Pending, and Completed counts.
 * Numbers are derived from the tasks array in App.jsx and passed down as `stats`.
 *
 * Props:
 *   stats {object} — { total: number, pending: number, completed: number }
 */

import React from 'react';
import PropTypes from 'prop-types';

function StatsCard({ stats }) {
  const items = [
    { label: 'Total Tasks',  value: stats.total,     modifier: 'total'     },
    { label: 'Pending',      value: stats.pending,   modifier: 'pending'   },
    { label: 'Completed',    value: stats.completed, modifier: 'completed' },
  ];

  return (
    <div className="stats-row">
      {items.map(({ label, value, modifier }) => (
        <div key={modifier} className={`stats-card stats-card--${modifier}`}>
          <span className="stats-card__value">{value}</span>
          <span className="stats-card__label">{label}</span>
        </div>
      ))}
    </div>
  );
}

StatsCard.propTypes = {
  stats: PropTypes.shape({
    total:     PropTypes.number.isRequired,
    pending:   PropTypes.number.isRequired,
    completed: PropTypes.number.isRequired,
  }).isRequired,
};

export default StatsCard;
