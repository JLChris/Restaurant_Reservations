const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function create(req, res) {
    const tableData = req.body.data;
    const newTable = await service.create(tableData);
    res.status(201).json({ data: newTable });
}

async function list(req, res) {
    const tables = await service.list();
    res.json({ data: tables });
}

async function update(req, res) {
    const tableId = req.params.table_id;
    const params = req.body.data;
    await service.update(tableId, params);
    res.status(201).json({});
}

module.exports = {
    create: asyncErrorBoundary(create),
    list: asyncErrorBoundary(list),
    update: asyncErrorBoundary(update)
}