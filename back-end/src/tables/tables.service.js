const knex = require("../db/connection");

function create(newTable) {
    return knex("tables").insert(newTable).returning("*");
}

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name");
}

function update(tableId, params) {
    return knex("tables")
        .where({ "table_id": tableId })
        .update({
            ...params
        });
}

function read(tableId) {
    return knex("tables")
        .where({ "table_id": tableId })
        .first();
}

function readReservation(resId) {
    return knex("reservations")
        .where({ "reservation_id": resId })
        .first();
}

module.exports = {
    create,
    list,
    update,
    read,
    readReservation
}