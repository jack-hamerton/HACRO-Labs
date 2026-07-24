/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3852321217")

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "select1567829341",
    "maxSelect": 0,
    "name": "loan_type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "IL",
      "GIL"
    ]
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3852321217")

  // remove field
  collection.fields.removeById("select1567829341")

  return app.save(collection)
})
