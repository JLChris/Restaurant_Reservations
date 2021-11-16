const knex = require("../db/connection");

function create(newTable) {
    return knex("tables").insert(newTable).returning("*");
}

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name");
}

function update(tableId, reservationId) {
    return knex("tables")
        .where({ "table_id": tableId })
        .update({
            reservation_id: reservationId,
            status: "Occupied"
        });
}

module.exports = {
    create,
    list,
    update
}