# Changelog

## 2026-11-11

- Added a static teaching scaffold: timeline, topic filters, trial snapshot dialog, search, learning path, and board-style practice items.
- Added sample JSON only. Every record is flagged `verified: false` and labeled Not yet verified, placeholder.
- Added `data/schema.json` and `scripts/verify-integrity.js` to check shape, source fields, placeholder flags, and blocked label text.
- Added a GitHub Actions workflow that runs the integrity check on pull requests.
