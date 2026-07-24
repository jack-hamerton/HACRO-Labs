/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_1233449815")

  // remove field
  collection.fields.removeById("text1972884478")

  // remove field
  collection.fields.removeById("text4266973511")

  // remove field
  collection.fields.removeById("text1567829341")

  // remove field
  collection.fields.removeById("text2063623452")

  // remove field
  collection.fields.removeById("date2862495610")

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
    "minSelect": 0,
    "name": "group_id",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  // add field
  collection.fields.addAt(4, new Field({
    "hidden": false,
    "id": "select2063623452",
    "maxSelect": 0,
    "name": "status",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "select",
    "values": [
      "pending",
      "approved",
      "active",
      "partially_paid",
      "fully_paid",
      "rejected",
      "defaulted"
    ]
  }))

  // add field
  collection.fields.addAt(5, new Field({
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
  collection.fields.addAt(11, new Field({
    "hidden": false,
    "id": "date2551559583",
    "max": "",
    "min": "",
    "name": "repayment_start_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(12, new Field({
    "hidden": false,
    "id": "date148477310",
    "max": "",
    "min": "",
    "name": "grace_period_end_date",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(14, new Field({
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
  collection.fields.addAt(15, new Field({
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
  const collection = app.findCollectionByNameOrId("pbc_1233449815")

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
  collection.fields.addAt(2, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text4266973511",
    "max": 0,
    "min": 0,
    "name": "group_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
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

  // add field
  collection.fields.addAt(7, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text2063623452",
    "max": 0,
    "min": 0,
    "name": "status",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  // add field
  collection.fields.addAt(10, new Field({
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

  // remove field
  collection.fields.removeById("relation1972884478")

  // remove field
  collection.fields.removeById("relation4266973511")

  // remove field
  collection.fields.removeById("select2063623452")

  // remove field
  collection.fields.removeById("select1567829341")

  // remove field
  collection.fields.removeById("date2551559583")

  // remove field
  collection.fields.removeById("date148477310")

  // remove field
  collection.fields.removeById("text3463677583")

  // remove field
  collection.fields.removeById("number3860725359")

  return app.save(collection)
})
