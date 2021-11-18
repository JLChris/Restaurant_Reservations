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

function update(resId, params) {
    return knex("reservations")
        .where({ "reservation_id": resId })
        .update({
            ...params
        });
}

module.exports = {
    list,
    create,
    read,
    update
}