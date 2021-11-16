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

function validDateAndTime(req, res, next) {
  const errors = [];
  const reservation = res.locals.reservation;
  const date = new Date(`${reservation.reservation_date}T${reservation.reservation_time}`);
  const today = new Date();
  if (date.getUTCDay() === 2) {
    errors.push("The restaurant is closed on Tuesdays. Please pick a different day.");
  }
  if (date - today < 0) {
    errors.push("Cannot book a past date.")
  }
  if (date.getHours() <= 10) {
    if (date.getHours() === 10 && date.getMinutes() < 30) {
      errors.push("Restaurant opens at 10:30am. Please pick a later time.");
    }
    errors.push("Restaurant opens at 10:30am. Please pick a later time.");
  }
  if (date.getHours() >= 21) {
    if (date.getHours() === 21 && date.getMinutes() > 30) {
      errors.push("Restaurant closes at 10:30pm. We would like you to have time to enjoy your meal. Please pick an earlier time.");
    }
    errors.push("Restaurant closes at 10:30pm. We would like you to have time to enjoy your meal. Please pick an earlier time.");
  }
  if (errors.length === 0) {
    return next();
  }
  next({
    status: 400,
    message: `${errors.join(" ")}`
  });
}

async function reservationExists(req, res, next) {
  const resId = req.params.reservation_id;
  const reservation = await service.read(resId);
  if (reservation) {
    res.locals.foundReservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Could not find reservation matching id: ${resId}`
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

function read(req, res) {
  const reservation = res.locals.foundReservation;
  res.json({ data: reservation });
}

async function update(req, res) {
  const resId = res.locals.foundReservation.reservation_id;
  const status = req.body.data.status;
  await service.update(resId, status);
  res.sendStatus(201);
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasRequiredFields, validDateAndTime, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(update)]
};
