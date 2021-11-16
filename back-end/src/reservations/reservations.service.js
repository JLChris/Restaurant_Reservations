const knex = require("../db/connection");

function list(date) {
    return knex("reservations")
        .select("*")
        .where({ "reservation_date": date })
        .orderBy("reservation_time");
}

function create(newReservation) {
    return knex("reservations").insert(newReservation).returning("*");
}

function read(resId) {
    return knex("reservations")
        .select("*")
        .where({ "reservation_id": resId })
        .first();
}

function update(resId, newStatus) {
    return knex("reservations")
        .where({ "reservation_id": resId })
        .update({
            status: newStatus
        });
}

module.exports = {
    list,
    create,
    read,
    update
}