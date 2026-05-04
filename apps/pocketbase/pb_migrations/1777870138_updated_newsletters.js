/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("newsletters")

  // update collection data
  unmarshal({
    "listRule": "published = true",
    "name": "newsletter_archive",
    "viewRule": "published = true"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("newsletters")

  // update collection data
  unmarshal({
    "listRule": null,
    "name": "newsletters",
    "viewRule": null
  }, collection)

  return app.save(collection)
})
