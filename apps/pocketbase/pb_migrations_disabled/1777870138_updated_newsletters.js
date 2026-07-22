

migrate((app) => {
  const collection = app.findCollectionByNameOrId("newsletters")

  

  unmarshal({
    "listRule": "published = true",
    "name": "newsletter_archive",
    "viewRule": "published = true"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("newsletters")

  

  unmarshal({
    "listRule": null,
    "name": "newsletters",
    "viewRule": null
  }, collection)

  return app.save(collection)
})
