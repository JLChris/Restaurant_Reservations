/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const requiredFields = ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"];

function isValidTime(value) {
  var hasMeridian = false;
  var re = /^\d{1,2}[:]\d{2}([:]\d{2})?( [aApP][mM]?)?$/;
  if (!re.test(value)) { return false; }
  if (value.toLowerCase().indexOf("p") != -1) { hasMeridian = true; }
  if (value.toLowerCase().indexOf("a") != -1) { hasMeridian = true; }
  var values = value.split(":");
  if ((parseFloat(values[0]) < 0) || (parseFloat(values[0]) > 23)) { return false; }
  if (hasMeridian) {
    if ((parseFloat(values[0]) < 1) || (parseFloat(values[0]) > 12)) { return false; }
  }
  if ((parseFloat(values[1]) < 0) || (parseFloat(values[1]) > 59)) { return false; }
  if (values.length > 2) {
    if ((parseFloat(values[2]) < 0) || (parseFloat(values[2]) > 59)) { return false; }
  }
  return true;
}

function hasRequiredFields(req, res, next) {
  const data = req.body.data;
  const keys = [];
  const missingFields = [];
  for (let key in data) {
    if (!requiredFields.includes(key)) {
      missingFields.push(key);
    }
    keys.push(key);
  }
  requiredFields.forEach(field => {
    if (!keys.includes(field)) {
      missingFields.push(field);
    }
  });
  if (missingFields.length === 0) {
    res.locals.reservation = data;
    return next();
  }
  next({
    status: 400,
    message: `Body is missing the following properties: ${missingFields.join(", ")}`
  });
}

function validateFields(req, res, next) {
  const data = req.body.data;
  const missingFields = [];
  if (!data.first_name || data.first_name.length < 1) {
    missingFields.push("first_name")
  }
  if (!data.last_name || data.last_name.length < 1) {
    missingFields.push("last_name");
  }
  if (!data.mobile_number || data.mobile_number.length < 1) {
    missingFields.push("mobile_number");
  }
  if (!data.reservation_date || data.reservation_date.length < 1 || !Date.parse(data.reservation_date)) {
    missingFields.push("reservation_date");
  }
  if (!data.reservation_time || data.reservation_time.length < 1 || !isValidTime(data.reservation_time)) {
    missingFields.push("reservation_time");
  }
  if (!data.people || data.people === 0 || typeof data.people !== "number") {
    missingFields.push("people");
  }
  if (missingFields.length === 0) {
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
    errors.push("Please pick a date in the future.")
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
  const phone = req.query.mobile_number;
  const data = await service.list(date, phone);
  res.json({ data });
}

async function create(req, res) {
  const newReservation = res.locals.reservation;
  const data = await service.create(newReservation);
  res.status(201).json({ data: data[0] });
}

function read(req, res) {
  const reservation = res.locals.foundReservation;
  res.json({ data: reservation });
}

async function update(req, res) {
  const resId = res.locals.foundReservation.reservation_id;
  const params = req.body.data;
  await service.update(resId, params);
  res.sendStatus(201);
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasRequiredFields, validateFields, validDateAndTime, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  update: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(update)]
};
