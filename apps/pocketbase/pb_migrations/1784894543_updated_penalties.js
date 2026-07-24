/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3702822455")

  // remove field
  collection.fields.removeById("text3463677583")

  // remove field
  collection.fields.removeById("text1972884478")

  // add field
  collection.fields.addAt(1, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_1233449815",
    "hidden": false,
    "id": "relation3463677583",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "loan_id",
    "presentable": false,
    "required": false,
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
    "id": "date521793643",
    "max": "",
    "min": "",
    "name": "date_applied",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "date"
  }))

  // add field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool1202738415",
    "name": "waived",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  // add field
  collection.fields.addAt(9, new Field({
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

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3702822455")

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

  // remove field
  collection.fields.removeById("relation3463677583")

  // remove field
  collection.fields.removeById("relation1972884478")

  // remove field
  collection.fields.removeById("date521793643")

  // remove field
  collection.fields.removeById("bool1202738415")

  // remove field
  collection.fields.removeById("text4266973511")

  return app.save(collection)
})
