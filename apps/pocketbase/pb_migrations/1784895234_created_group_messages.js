/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": true,
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
      },
      {
        "cascadeDelete": true,
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
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text4274335913",
        "max": 0,
        "min": 0,
        "name": "content",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": true,
        "system": false,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_2620428958",
        "hidden": false,
        "id": "relation4129600413",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "sender_id",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "select2363381545",
        "maxSelect": 0,
        "name": "type",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "select",
        "values": [
          "message",
          "system",
          "announcement"
        ]
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text1483141754",
        "max": 0,
        "min": 0,
        "name": "gm",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      }
    ],
    "id": "pbc_4124649342",
    "indexes": [],
    "listRule": null,
    "name": "group_messages",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_4124649342");

  return app.delete(collection);
})
