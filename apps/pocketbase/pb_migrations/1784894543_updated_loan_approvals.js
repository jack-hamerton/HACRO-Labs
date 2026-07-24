/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3508314067")

  // remove field
  collection.fields.removeById("text3463677583")

  // remove field
  collection.fields.removeById("text1972884478")

  // remove field
  collection.fields.removeById("text1002219032")

  // remove field
  collection.fields.removeById("number4268514218")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1233449815",
    "hidden": false,
    "id": "relation3463677583",
    "maxSelect": 1,
    "minSelect": 1,
    "name": "loan_id",
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
    "minSelect": 0,
    "name": "member_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select1002219032",
    "maxSelect": 0,
    "name": "vote_type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "approval",
      "guarantor_confirmation"
    ]
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "hidden": false,
    "id": "bool3529047816",
    "name": "voted",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
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

  // remove field
  collection.fields.removeById("relation3463677583")

  // remove field
  collection.fields.removeById("relation1972884478")

  // remove field
  collection.fields.removeById("select1002219032")

  // remove field
  collection.fields.removeById("bool3529047816")

  return app.save(collection)
})
