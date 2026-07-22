

migrate((app) => {
  const collection = new Collection({
    createRule: null,
    deleteRule: null,
    fields: [
      {
        autogeneratePattern: "[a-z0-9]{15}",
        hidden: false,
        id: "text3208210256",
        max: 15,
        min: 15,
        name: "id",
        pattern: "^[a-z0-9]+$",
        presentable: false,
        primaryKey: true,
        required: true,
        system: true,
        type: "text"
      },
      {
        hidden: false,
        id: "autodate2990956",
        name: "created",
        onCreate: true,
        onUpdate: false,
        presentable: false,
        required: false,
        system: true,
        type: "autodate"
      },
      {
        hidden: false,
        id: "autodate3669132",
        name: "updated",
        onCreate: true,
        onUpdate: true,
        presentable: false,
        required: false,
        system: true,
        type: "autodate"
      },
      {
        cascadeDelete: true,
        collectionId: "9rwstoyhiuekvpm",
        hidden: false,
        id: "relation7891234",
        maxSelect: 1,
        minSelect: 1,
        name: "member_id",
        presentable: false,
        required: true,
        system: false,
        type: "relation"
      },
      {
        hidden: false,
        id: "select5678901",
        maxSelect: 1,
        name: "withdrawal_type",
        presentable: false,
        required: true,
        system: false,
        type: "select",
        values: ["85_percent", "requested", "emergency"]
      },
      {
        hidden: false,
        id: "number1234567",
        max: null,
        min: 0,
        name: "total_savings_at_withdrawal",
        noDecimal: false,
        presentable: false,
        required: false,
        system: false,
        type: "number"
      },
      {
        hidden: false,
        id: "number2345678",
        max: null,
        min: 0,
        name: "withdrawal_amount_85",
        noDecimal: false,
        presentable: false,
        required: false,
        system: false,
        type: "number"
      },
      {
        hidden: false,
        id: "number3456789",
        max: null,
        min: 0,
        name: "carry_forward_15",
        noDecimal: false,
        presentable: false,
        required: false,
        system: false,
        type: "number"
      },
      {
        hidden: false,
        id: "date4567890",
        max: "",
        min: "",
        name: "withdrawal_date",
        presentable: false,
        required: false,
        system: false,
        type: "date"
      },
      {
        hidden: false,
        id: "date5678901",
        max: "",
        min: "",
        name: "next_withdrawal_date",
        presentable: false,
        required: false,
        system: false,
        type: "date"
      },
      {
        hidden: false,
        id: "select6789012",
        maxSelect: 1,
        name: "status",
        presentable: false,
        required: true,
        system: false,
        type: "select",
        values: ["pending", "approved", "processed", "rejected"]
      },
      {
        hidden: false,
        id: "text7890123",
        max: null,
        min: null,
        name: "notes",
        pattern: "",
        presentable: false,
        required: false,
        system: false,
        type: "text"
      }
    ],
    id: "pbc_7890123456",
    indexes: [],
    listRule: null,
    name: "withdrawals",
    system: false,
    type: "base",
    updateRule: null,
    viewRule: null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_7890123456");
  return app.delete(collection);
});
