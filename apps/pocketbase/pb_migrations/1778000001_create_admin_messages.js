/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "id": "admmsg1234567890",
    "created": "2026-07-05 00:00:00.000Z",
    "updated": "2026-07-05 00:00:00.000Z",
    "name": "admin_messages",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fld_sender",
        "name": "sender",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "pbc_admins_auth",
          "cascadeDelete": false,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": ["first_name","last_name","email"]
        }
      },
      {
        "system": false,
        "id": "fld_reply_to",
        "name": "reply_to",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "admmsg1234567890",
          "cascadeDelete": false,
          "minSelect": 0,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "fld_message",
        "name": "message",
        "type": "text",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": { "min": null, "max": null, "pattern": "" }
      },
      {
        "system": false,
        "id": "fld_pinned",
        "name": "pinned",
        "type": "bool",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("admmsg1234567890");
  return app.delete(collection);
});
