const knex = require("../db/connection");

function list(date, phone) {
    if (date) {
        return knex("reservations")
            .select("*")
            .where({ "reservation_date": date })
            .whereNot({ "status": "finished" })
            .orderBy("reservation_time");
    } else if (phone) {
        return knex("reservations")
            .select("*")
            .whereRaw("translate(mobile_number, '()-', '') like ?", `%${phone.replace(/\D/g, "")}%`)
            .orderBy("reservation_date");
    }

}

function create(newReservation) {
    return knex("reservations")
        .insert(newReservation)
        .returning("*");
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
        })
        .returning("*");
}

module.exports = {
    list,
    create,
    read,
    update
}