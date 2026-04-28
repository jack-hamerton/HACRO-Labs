/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "726ulyp7s0nzffv",
    "created": "2026-04-28 05:29:17.557Z",
    "updated": "2026-04-28 05:29:17.557Z",
    "name": "group_members",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "3umtidh3",
        "name": "group_id",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "gnxowsj8w9s41j6",
          "cascadeDelete": true,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "juxihgvo",
        "name": "member_id",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "9rwstoyhiuekvpm",
          "cascadeDelete": true,
          "minSelect": 1,
          "maxSelect": 1,
          "displayFields": null
        }
      },
      {
        "system": false,
        "id": "zcy3n3mq",
        "name": "joined_date",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
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

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("726ulyp7s0nzffv");

  return dao.deleteCollection(collection);
})
