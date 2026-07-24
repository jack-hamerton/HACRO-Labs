/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2203197687")

  // add field
  collection.fields.addAt(1, new Field({
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
  collection.fields.addAt(2, new Field({
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
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "number2392944706",
    "max": null,
    "min": 0,
    "name": "amount",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "number3860725359",
    "max": null,
    "min": 0,
    "name": "total_savings",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "date2862495610",
    "max": "",
    "min": "",
    "name": "date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "date3235307258",
    "max": "",
    "min": "",
    "name": "last_contribution_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1843675174",
    "max": 0,
    "min": 0,
    "name": "description",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(8, new Field({
    "hidden": false,
    "id": "number3633070846",
    "max": null,
    "min": 0,
    "name": "held_collateral",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2203197687")

  // remove field
  collection.fields.removeById("relation1972884478")

  // remove field
  collection.fields.removeById("relation4266973511")

  // remove field
  collection.fields.removeById("number2392944706")

  // remove field
  collection.fields.removeById("number3860725359")

  // remove field
  collection.fields.removeById("date2862495610")

  // remove field
  collection.fields.removeById("date3235307258")

  // remove field
  collection.fields.removeById("text1843675174")

  // remove field
  collection.fields.removeById("number3633070846")

  return app.save(collection)
})
