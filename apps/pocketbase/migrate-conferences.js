#!/usr/bin/env node
// Lightweight CLI wrapper to run the setup-schema migration focused on conferencing
// Usage: node migrate-conferences.js

import('./setup-schema.js')
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
