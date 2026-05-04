/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId('newsletters');
  if (!collection) {
    throw new Error('newsletters collection not found');
  }

  collection.listRule = 'published = true';
  collection.viewRule = 'published = true';

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId('newsletters');
  if (!collection) {
    throw new Error('newsletters collection not found');
  }

  collection.listRule = null;
  collection.viewRule = null;

  return app.save(collection);
});
