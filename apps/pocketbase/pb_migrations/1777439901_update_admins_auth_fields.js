/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  // Try to find the admins collection
  let collection = app.findCollectionByNameOrId("admins");
  
  if (!collection) {
    // If it doesn't exist, create it
    collection = new Collection({
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
          "encrypted": false,
          "hidden": false,
          "id": "email8993121",
          "name": "email",
          "presentable": true,
          "required": true,
          "searchable": true,
          "system": false,
          "type": "email",
          "unique": true
        },
        {
          "hidden": false,
          "id": "password5555555",
          "name": "password",
          "pattern": "",
          "presentable": false,
          "required": true,
          "system": false,
          "type": "password"
        },
        {
          "hidden": false,
          "id": "text6666666",
          "max": 0,
          "min": 0,
          "name": "first_name",
          "pattern": "",
          "presentable": true,
          "required": false,
          "searchable": false,
          "system": false,
          "type": "text"
        },
        {
          "hidden": false,
          "id": "text7777777",
          "max": 0,
          "min": 0,
          "name": "last_name",
          "pattern": "",
          "presentable": true,
          "required": false,
          "searchable": false,
          "system": false,
          "type": "text"
        }
      ],
      "id": "pbc_admins_final",
      "indexes": [
        "CREATE UNIQUE INDEX `idx_admins_email` on `admins` (`email`)"
      ],
      "listRule": null,
      "name": "admins",
      "system": false,
      "type": "auth",
      "updateRule": null,
      "viewRule": null
    });
    return app.save(collection);
  }

  // If it exists, add missing fields
  const emailField = collection.fields.find(f => f.name === "email");
  const passwordField = collection.fields.find(f => f.name === "password");
  
  if (!emailField) {
    collection.fields.push({
      "encrypted": false,
      "hidden": false,
      "id": "email8993121",
      "name": "email",
      "presentable": true,
      "required": true,
      "searchable": true,
      "system": false,
      "type": "email",
      "unique": true
    });
  }
  
  if (!passwordField) {
    collection.fields.push({
      "hidden": false,
      "id": "password5555555",
      "name": "password",
      "pattern": "",
      "presentable": false,
      "required": true,
      "system": false,
      "type": "password"
    });
  }
  
  // Ensure first_name and last_name exist
  const firstNameField = collection.fields.find(f => f.name === "first_name");
  const lastNameField = collection.fields.find(f => f.name === "last_name");
  
  if (!firstNameField) {
    collection.fields.push({
      "hidden": false,
      "id": "text6666666",
      "max": 0,
      "min": 0,
      "name": "first_name",
      "pattern": "",
      "presentable": true,
      "required": false,
      "searchable": false,
      "system": false,
      "type": "text"
    });
  }
  
  if (!lastNameField) {
    collection.fields.push({
      "hidden": false,
      "id": "text7777777",
      "max": 0,
      "min": 0,
      "name": "last_name",
      "pattern": "",
      "presentable": true,
      "required": false,
      "searchable": false,
      "system": false,
      "type": "text"
    });
  }

  // Change type to auth if it's not already
  if (collection.type !== "auth") {
    collection.type = "auth";
  }

  return app.save(collection);
}, (app) => {
  // Rollback
  const collection = app.findCollectionByNameOrId("admins");
  if (collection) {
    return app.delete(collection);
  }
});
