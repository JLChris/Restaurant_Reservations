/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const requiredFields = ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"];

function hasRequiredFields(req, res, next) {
  const keys = [];
  const missingFields = [];
  for (let key in req.body.data) {
    keys.push(key);
  }
  requiredFields.forEach(field => {
    if (!keys.includes(field)) {
      missingFields.push(field);
    }
  });
  if (missingFields.length === 0) {
    res.locals.reservation = req.body.data;
    return next();
  }
  next({
    status: 400,
    message: `Body is missing the following properties: ${missingFields.join(", ")}`
  });
}

function validDate(req, res, next) {
  const errors = [];
  const reservation = res.locals.reservation;
  const date = new Date(`${reservation.reservation_date}T${reservation.reservation_time}`);
  const today = new Date();
  if (date.getUTCDay() === 2) {
    errors.push("The restaurant is closed on Tuesdays.");
  }
  if (date - today < 0) {
    errors.push("Cannot book a past date.")
  }
  if (errors.length === 0) {
    return next();
  }
  next({
    status: 400,
    message: `${errors.join(" ")} Please pick a different day.`
  });
}

async function list(req, res) {
  const date = req.query.date;
  const data = await service.list(date);
  res.json({ data });
}

async function create(req, res) {
  const newReservation = res.locals.reservation;
  const data = await service.create(newReservation);
  res.status(201).json({ data });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasRequiredFields, validDate, asyncErrorBoundary(create)],
};
