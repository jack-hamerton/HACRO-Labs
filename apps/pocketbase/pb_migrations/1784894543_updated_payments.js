/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_631030571")

  // remove field
  collection.fields.removeById("text1972884478")

  // remove field
  collection.fields.removeById("text2908602461")

  // remove field
  collection.fields.removeById("text1580793482")

  // remove field
  collection.fields.removeById("text79930299")

  // add field
  collection.fields.addAt(1, new Field({
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
  collection.fields.addAt(3, new Field({
    "hidden": false,
    "id": "select2908602461",
    "maxSelect": 0,
    "name": "payment_type",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "registration",
      "insurance",
      "loan_repayment",
      "other"
    ]
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select1580793482",
    "maxSelect": 0,
    "name": "payment_status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "pending",
      "completed",
      "failed"
    ]
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "hidden": false,
    "id": "date2333974542",
    "max": "",
    "min": "",
    "name": "payment_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(6, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2849095986",
    "max": 0,
    "min": 0,
    "name": "first_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text3356015194",
    "max": 0,
    "min": 0,
    "name": "last_name",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_631030571")

  // add field
  collection.fields.addAt(1, new Field({
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
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2908602461",
    "max": 0,
    "min": 0,
    "name": "payment_type",
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
    "id": "text1580793482",
    "max": 0,
    "min": 0,
    "name": "payment_status",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(5, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text79930299",
    "max": 0,
    "min": 0,
    "name": "payment_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // remove field
  collection.fields.removeById("relation1972884478")

  // remove field
  collection.fields.removeById("select2908602461")

  // remove field
  collection.fields.removeById("select1580793482")

  // remove field
  collection.fields.removeById("date2333974542")

  // remove field
  collection.fields.removeById("text2849095986")

  // remove field
  collection.fields.removeById("text3356015194")

  return app.save(collection)
})
