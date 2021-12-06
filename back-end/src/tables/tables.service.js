const knex = require("../db/connection");

function create(newTable) {
    return knex("tables").insert(newTable).returning("*");
}

function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name");
}

function update(tableId, resId) {
    return knex("tables")
        .where({ "table_id": tableId })
        .update({
            reservation_id: resId,
            status: "Occupied"
        })
        .returning("*");
}

function updateReservation(resId, newStatus) {
    return knex("reservations")
        .where({ "reservation_id": resId })
        .update({
            status: newStatus
        })
        .returning("*");
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

function destroy(tableId) {
    return knex("tables")
        .where({ "table_id": tableId })
        .update({
            status: "Free",
            reservation_id: null
        });
}

module.exports = {
    create,
    list,
    update,
    read,
    readReservation,
    delete: destroy,
    updateReservation,
}