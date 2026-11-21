/// <reference path="../pb_data/types.d.ts" />

// This migration is intentionally disabled. PocketBase uses the live SQLite
// database at pb_data and application setup is not dependent on Express.
migrate((app) => {
  return;
}, (app) => {
  return;
});
