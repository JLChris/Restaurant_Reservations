const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function validateData(req, res, next) {
    const data = req.body.data;
    const message = [];
    if (data === undefined) {
        message.push("Request body is missing a data property.")
    } else {
        if (!data.table_name || data.table_name.length < 2) {
            message.push("Request body is missing a 'table_name' key.")
        }
        if (!data.capacity || data.capacity === 0 || typeof data.capacity !== "number") {
            message.push("Request body is missing a 'capacity' key.")
        }
    }
    if (message.length === 0) {
        res.locals.data = data;
        return next();
    }
    next({
        status: 400,
        message: `${message.join("; ")}`
    });
}

async function tableExists(req, res, next) {
    const id = req.params.table_id;
    const foundTable = await service.read(id);
    if (foundTable) {
        res.locals.table = foundTable;
        return next();
    }
    next({
        status: 404,
        message: "Table not found."
    });
}

async function reservationExists(req, res, next) {
    if (req.body.data === undefined) {
        return next({
            status: 400,
            message: "Request body is missing data property."
        });
    }
    const id = req.body.data.reservation_id;
    if (id === undefined) {
        return next({
            status: 400,
            message: "Request is missing a 'reservation_id' key."
        });
    }
    const foundRes = await service.readReservation(id);
    if (foundRes) {
        res.locals.reservation = foundRes;
        return next();
    }
    next({
        status: 404,
        message: `Reservation with id: ${id} does not exist.`
    });
}

function tableFitsReservation(req, res, next) {
    const data = req.body.data;
    const table = res.locals.table;
    const reservation = res.locals.reservation;
    const message = [];
    if (data === undefined) {
        message.push("Request body is missing a data property.");
    } else {
        if (table.capacity < reservation.people) {
            message.push("Table does not have sufficient capacity.");
        }
        if (table.status === "Occupied") {
            message.push("Table is already occupied.");
        }
    }
    if (message.length === 0) {
        return next();
    }
    next({
        status: 400,
        message: `${message.join("; ")}`
    });
}

async function create(req, res) {
    const tableData = res.locals.data;
    const newTable = await service.create(tableData);
    res.status(201).json({ data: newTable[0] });
}

async function list(req, res) {
    const tables = await service.list();
    res.json({ data: tables });
}

async function update(req, res) {
    const table = res.locals.table;
    const params = req.body.data;
    await service.update(table.table_id, params);
    res.json({});
}

module.exports = {
    create: [validateData, asyncErrorBoundary(create)],
    list: asyncErrorBoundary(list),
    update: [
        asyncErrorBoundary(tableExists),
        asyncErrorBoundary(reservationExists),
        tableFitsReservation,
        asyncErrorBoundary(update)
    ]
}