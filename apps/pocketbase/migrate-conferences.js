#!/usr/bin/env node





import('./setup-schema.js')
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
  });
