/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3363079774")

  // add field
  collection.fields.addAt(8, new Field({
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
  collection.fields.addAt(9, new Field({
    "hidden": false,
    "id": "date663409265",
    "max": "",
    "min": "",
    "name": "disbursement_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(10, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1547007399",
    "max": 0,
    "min": 0,
    "name": "guarantor_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "number1908588469",
    "max": null,
    "min": null,
    "name": "interest_rate",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  // add field
  collection.fields.addAt(12, new Field({
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
  collection.fields.addAt(13, new Field({
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

  // add field
  collection.fields.addAt(14, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1146066909",
    "max": 0,
    "min": 0,
    "name": "phone",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(15, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1795275867",
    "max": 0,
    "min": 0,
    "name": "phone_number",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(16, new Field({
    "hidden": false,
    "id": "number3860725359",
    "max": null,
    "min": null,
    "name": "total_savings",
    "onlyInt": false,
    "presentable": false,
    "required": false,
    "system": false,
    "type": "number"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3363079774")

  // remove field
  collection.fields.removeById("number4268514218")

  // remove field
  collection.fields.removeById("date663409265")

  // remove field
  collection.fields.removeById("text1547007399")

  // remove field
  collection.fields.removeById("number1908588469")

  // remove field
  collection.fields.removeById("text3463677583")

  // remove field
  collection.fields.removeById("select1567829341")

  // remove field
  collection.fields.removeById("text1146066909")

  // remove field
  collection.fields.removeById("text1795275867")

  // remove field
  collection.fields.removeById("number3860725359")

  return app.save(collection)
})
