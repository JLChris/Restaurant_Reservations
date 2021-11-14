const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { as } = require("../db/connection");

async function create(req, res) {
    const tableData = req.body.data;
    const newTable = await service.create(tableData);
    res.status(201).json({ data: newTable });
}

async function list(req, res) {
    const tables = await service.list();
    res.json({ data: tables });
}

module.exports = {
    create: asyncErrorBoundary(create),
    list: asyncErrorBoundary(list)
}