/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const adminSessions = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text_admin_session_id",
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
        "id": "autodate_admin_session_created",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate_admin_session_updated",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "text_admin_session_admin_id",
        "max": 0,
        "min": 0,
        "name": "admin_id",
        "pattern": "",
        "presentable": true,
        "required": true,
        "searchable": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "text_admin_session_token",
        "max": 0,
        "min": 0,
        "name": "token",
        "pattern": "",
        "presentable": true,
        "required": true,
        "searchable": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "text_admin_session_expires_date",
        "max": 0,
        "min": 0,
        "name": "expires_date",
        "pattern": "",
        "presentable": true,
        "required": true,
        "searchable": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "text_admin_session_ip_address",
        "max": 0,
        "min": 0,
        "name": "ip_address",
        "pattern": "",
        "presentable": true,
        "required": false,
        "searchable": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "text_admin_session_user_agent",
        "max": 0,
        "min": 0,
        "name": "user_agent",
        "pattern": "",
        "presentable": true,
        "required": false,
        "searchable": false,
        "system": false,
        "type": "text"
      }
    ],
    "id": "admin_sessions",
    "indexes": [
      "CREATE UNIQUE INDEX `idx_admin_sessions_token` on `admin_sessions` (`token`)"
    ],
    "listRule": null,
    "name": "admin_sessions",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  const adminActivityLog = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text_admin_activity_log_id",
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
        "id": "autodate_admin_activity_log_created",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate_admin_activity_log_updated",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "text_admin_activity_log_admin_id",
        "max": 0,
        "min": 0,
        "name": "admin_id",
        "pattern": "",
        "presentable": true,
        "required": true,
        "searchable": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "text_admin_activity_log_action",
        "max": 0,
        "min": 0,
        "name": "action",
        "pattern": "",
        "presentable": true,
        "required": true,
        "searchable": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "text_admin_activity_log_details",
        "max": 0,
        "min": 0,
        "name": "details",
        "pattern": "",
        "presentable": true,
        "required": false,
        "searchable": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "text_admin_activity_log_ip_address",
        "max": 0,
        "min": 0,
        "name": "ip_address",
        "pattern": "",
        "presentable": true,
        "required": false,
        "searchable": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "text_admin_activity_log_user_agent",
        "max": 0,
        "min": 0,
        "name": "user_agent",
        "pattern": "",
        "presentable": true,
        "required": false,
        "searchable": false,
        "system": false,
        "type": "text"
      }
    ],
    "id": "admin_activity_log",
    "indexes": [],
    "listRule": null,
    "name": "admin_activity_log",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  app.save(adminSessions);
  app.save(adminActivityLog);
}, (app) => {
  const adminSessions = app.findCollectionByNameOrId("admin_sessions");
  if (adminSessions) {
    app.delete(adminSessions);
  }
  const adminActivityLog = app.findCollectionByNameOrId("admin_activity_log");
  if (adminActivityLog) {
    app.delete(adminActivityLog);
  }
});