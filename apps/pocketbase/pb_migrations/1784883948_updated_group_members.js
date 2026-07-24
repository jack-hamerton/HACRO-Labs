/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_714390402")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_3346940990",
    "hidden": false,
    "id": "relation4266973511",
    "maxSelect": 1,
    "minSelect": 1,
    "name": "group_id",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2620428958",
    "hidden": false,
    "id": "relation1972884478",
    "maxSelect": 1,
    "minSelect": 1,
    "name": "member_id",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "date3083025321",
    "max": "",
    "min": "",
    "name": "joined_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_714390402")

  // remove field
  collection.fields.removeById("relation4266973511")

  // remove field
  collection.fields.removeById("relation1972884478")

  // remove field
  collection.fields.removeById("date3083025321")

  return app.save(collection)
})
