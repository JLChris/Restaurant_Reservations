
exports.up = function (knex) {
    return knex.schema.table("tables", table => {
        table.string("status").defaultTo("free");
    });
};

exports.down = function (knex) {
    return knex.schema.table("tables", table => {
        table.dropColumn("status");
    });
};
