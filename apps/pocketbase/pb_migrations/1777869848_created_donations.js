/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const existing = app.findCollectionByNameOrId("donations");
  if (existing) {
    return;
  }

  const collection = new Collection({
    "id": "pbc_donations_001",
    "name": "donations",
    "type": "base",
    "system": false,
    "schema": [
      {
        "name": "donor_name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "name": "donor_email",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "name": "donor_phone",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {}
      },
      {
        "name": "amount",
        "type": "number",
        "required": true,
        "presentable": false,
        "options": {}
      },
      {
        "name": "purpose",
        "type": "text",
        "required": false,
        "presentable": false,
        "options": {}
      },
      {
        "name": "payment_status",
        "type": "select",
        "required": true,
        "presentable": false,
        "options": {
          "maxSelect": 1,
          "values": ["pending", "completed", "failed"]
        }
      },
      {
        "name": "checkout_request_id",
        "type": "text",
        "required": false,
        "presentable": false,
        "options": {}
      },
      {
        "name": "merchant_request_id",
        "type": "text",
        "required": false,
        "presentable": false,
        "options": {}
      },
      {
        "name": "mpesa_reference",
        "type": "text",
        "required": false,
        "presentable": false,
        "options": {}
      },
      {
        "name": "payment_date",
        "type": "date",
        "required": false,
        "presentable": false,
        "options": {}
      },
      {
        "name": "result_code",
        "type": "text",
        "required": false,
        "presentable": false,
        "options": {}
      },
      {
        "name": "result_desc",
        "type": "text",
        "required": false,
        "presentable": false,
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
  const collection = app.findCollectionByNameOrId("donations");
  if (!collection) {
    return;
  }
  return app.delete(collection);
});
