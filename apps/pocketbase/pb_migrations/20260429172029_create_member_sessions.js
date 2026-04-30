/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const memberSessions = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text_member_session_id",
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
        "id": "autodate_member_session_created",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate_member_session_updated",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "text_member_session_member_id",
        "max": 0,
        "min": 0,
        "name": "member_id",
        "pattern": "",
        "presentable": true,
        "required": true,
        "searchable": true,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "text_member_session_token",
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
        "id": "text_member_session_expires_date",
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
        "id": "text_member_session_ip_address",
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
        "id": "text_member_session_user_agent",
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
    "id": "member_sessions",
    "indexes": [
      "CREATE UNIQUE INDEX `idx_member_sessions_token` on `member_sessions` (`token`)"
    ],
    "listRule": null,
    "name": "member_sessions",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(memberSessions);
});