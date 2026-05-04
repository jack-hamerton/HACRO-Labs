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
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "name": "title",
        "type": "text",
        "required": true,
        "presentable": true
      },
      {
        "name": "description",
        "type": "text",
        "required": false
      },
      {
        "name": "type",
        "type": "select",
        "required": true,
        "values": ["newspaper", "report", "video"]
      },
      {
        "name": "file",
        "type": "file",
        "required": true,
        "maxSelect": 1,
        "maxSize": 52428800, // 50MB
        "mimeTypes": ["application/pdf", "video/mp4", "video/avi", "video/mov", "video/wmv"]
      },
      {
        "name": "published",
        "type": "bool",
        "required": true,
        "default": false
      },
      {
        "name": "published_date",
        "type": "date",
        "required": false
      }
    ],
    "id": "newsletters",
    "indexes": [],
    "listRule": "published = true",
    "name": "newsletter_archive",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": "published = true"
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("newsletters");

  return app.delete(collection);
})