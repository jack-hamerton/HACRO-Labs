/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "2bj1nscie4qnoa2",
    "created": "2026-04-28 05:10:47.391Z",
    "updated": "2026-04-28 05:10:47.391Z",
    "name": "loans",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "pcvh42u9",
        "name": "loan_type",
        "type": "select",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSelect": 1,
          "values": [
            "IL",
            "GIL"
          ]
        }
      },
      {
        "system": false,
        "id": "xw0weer9",
        "name": "grace_period_end_date",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "q3mxfm4r",
        "name": "repayment_start_date",
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
  const collection = dao.findCollectionByNameOrId("2bj1nscie4qnoa2");

  return dao.deleteCollection(collection);
})
