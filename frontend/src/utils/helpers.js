/**
 * helpers.js — Shared Frontend Utility Functions
 *
 * Pure functions with no React dependencies.
 * Extracted here so they can be reused across components
 * without re-defining them inside each file.
 */

/**
 * Formats a date string into a human-readable format.
 * Example: "2026-05-12T15:00:00Z" → "12 May 2026"
 *
 * @param {string|Date} dateStr - ISO date string or Date object
 * @returns {string|null} - formatted date string, or null if no date provided
 */
export function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Returns true if the given date is strictly before today (midnight).
 * Used to highlight tasks whose due date has passed.
 *
 * @param {string|Date} dateStr - ISO date string or Date object
 * @returns {boolean}
 */
export function isOverdue(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // compare dates only, not times
  return new Date(dateStr) < today;
}
