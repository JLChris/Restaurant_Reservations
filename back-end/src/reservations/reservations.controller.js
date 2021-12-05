const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

/**
 * Test a string for valid HH:MM:SS time format
 * @param value
 * the string to test
 * @returns {boolean}
 * 
 */
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

/**
 * Check if request body has a data property
 */
function hasData(req, res, next) {
  if (req.body.data) {
    res.locals.data = req.body.data;
    return next();
  }
  next({
    status: 400,
    message: "Body is missing a data property"
  });
}

/**
 * Make sure all fields of the request are present and valid
 */
function validateFields(req, res, next) {
  const data = res.locals.data;
  const errors = [];
  if (!data.first_name || data.first_name.length < 1) {
    errors.push("Body is missing a 'first_name' field")
  }
  if (!data.last_name || data.last_name.length < 1) {
    errors.push("Body is missing a 'last_name' field");
  }
  if (!data.mobile_number || data.mobile_number.length < 1) {
    errors.push("Body is missing a 'mobile_number' field");
  }
  if (!data.reservation_date || data.reservation_date.length < 1 || !Date.parse(data.reservation_date)) {
    errors.push("Body is missing a valid reservation_date");
  }
  if (!data.reservation_time || data.reservation_time.length < 1 || !isValidTime(data.reservation_time)) {
    errors.push("Body is missing a valid reservation_time");
  }
  if (!data.people || data.people === 0 || typeof data.people !== "number") {
    errors.push("Body is missing a valid value for 'people'");
  }
  if (data.status === "seated" || data.status === "finished") {
    errors.push(`Status cannot equal ${data.status}. Status must be 'booked'`);
  }
  if (errors.length === 0) {
    return next();
  }
  next({
    status: 400,
    message: `${errors.join("; ")}`
  });
}

/**
 * Make sure reservation_date and reservation_time values are valid dates and times respectively
 */
function validDateAndTime(req, res, next) {
  const errors = [];
  const reservation = res.locals.data;
  const date = new Date(`${reservation.reservation_date}T${reservation.reservation_time}`);
  const today = new Date();
  if (date.getDay() === 2) {
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
    message: `${errors.join("; ")}`
  });
}

/**
 * Make sure reservation being updated actually exists
 */
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

/**
 * Make sure the status being entered for a reservation is one of the accepted statuses
 */
function validateStatus(req, res, next) {
  const data = res.locals.data;
  const validStatus = ["booked", "seated", "finished", "cancelled"];
  if (validStatus.includes(data.status)) {
    return next();
  }
  next({
    status: 400,
    message: "Request body contains unknown status"
  });
}

/**
 * Check to see if a reservation is finished or not. It cannot be updated if it is finished.
 */
function resIsFinished(req, res, next) {
  const reservation = res.locals.foundReservation;
  if (reservation.status !== "finished") {
    return next();
  }
  next({
    status: 400,
    message: "Cannot update a finished reservation"
  });
}

/**
 * List all reservations of a certain date or phone number
 */
async function list(req, res) {
  const date = req.query.date;
  const phone = req.query.mobile_number;
  const data = await service.list(date, phone);
  res.json({ data });
}

/**
 * Create a new reservation
 */
async function create(req, res) {
  const newReservation = res.locals.data;
  const data = await service.create(newReservation);
  res.status(201).json({ data: data[0] });
}

/**
 * Return a reservation with matching ID
 */
function read(req, res) {
  const reservation = res.locals.foundReservation;
  res.json({ data: reservation });
}

/**
 * Change the status of a reservation
 */
async function updateStatus(req, res) {
  const resId = res.locals.foundReservation.reservation_id;
  const status = res.locals.data.status;
  const data = await service.update(resId, { status });
  res.json({ data: data[0] });
}

/**
 * Update a reservation's information
 */
async function update(req, res) {
  const data = res.locals.data;
  const resId = res.locals.foundReservation.reservation_id;
  const result = await service.update(resId, data);
  res.json({ data: result[0] });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [hasData, validateFields, validDateAndTime, asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(reservationExists), read],
  updateStatus: [
    hasData,
    asyncErrorBoundary(reservationExists),
    validateStatus,
    resIsFinished,
    asyncErrorBoundary(updateStatus)
  ],
  update: [
    hasData,
    validateFields,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(update)
  ]
};
