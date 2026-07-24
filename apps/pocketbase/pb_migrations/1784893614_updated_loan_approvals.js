/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3508314067")

  // add field
  collection.fields.addAt(1, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3463677583",
    "max": 0,
    "min": 0,
    "name": "loan_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1972884478",
    "max": 0,
    "min": 0,
    "name": "member_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "bool2086131741",
    "name": "approved",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1002219032",
    "max": 0,
    "min": 0,
    "name": "vote_type",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "number4268514218",
    "max": null,
    "min": null,
    "name": "collateral_amount",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1567829341",
    "max": 0,
    "min": 0,
    "name": "loan_type",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3508314067")

  // remove field
  collection.fields.removeById("text3463677583")

  // remove field
  collection.fields.removeById("text1972884478")

  // remove field
  collection.fields.removeById("bool2086131741")

  // remove field
  collection.fields.removeById("text1002219032")

  // remove field
  collection.fields.removeById("number4268514218")

  // remove field
  collection.fields.removeById("text1567829341")

  return app.save(collection)
})
