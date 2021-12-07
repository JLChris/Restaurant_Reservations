# Periodic Tables: Restaurant Reservation Manager

A simple app designed to help restaurants manage their reservations.

The live application can be viewed [here](https://reservations-app-frontend.herokuapp.com/) 

To run the project locally, fork and clone this repository, then run `npm i` from the root directory.

Run `npm start` from the `/front-end` directory to start the client at `http://localhost:3000`.

Run `npm start` from the `/back-end` directory to start the server at `http://localhost:5000`.

***

## Screenshots

When you first open the app, you will be taken to the dashboard where you can see all the reservations on a certain day:

![Dashboard](/screenshots/Dashboard.png)


Clicking the "Seat" button allows you to assign the reservation to a table:

![Seat Reservation](/screenshots/Seat-Reservation.png)


The "Create Reservation" page allows you to enter a customer's information and book a new reservation:

![Create Reservation](/screenshots/Create-Reservation.png)

You can search for an existing reservation using a customer's phone number:

![Search page](/screenshots/Search.png)

***

## API Documentation

`/reservations`

- GET: Returns all reservations of a certain date or phone number (specified with the query parameters `?date` and `?mobile_number`).

- POST: Creates a new reservation

`/reservations/:reservation_id`

- GET: Returns the reservation with matching ID.

- PUT: Updates the reservations's info.

`/reservations/:reservation_id/status`

- PUT: Updates the status of existing reservation. Status can be "booked", "seated", "finished", or "cancelled".

`/tables`

- GET: Returns a list of all existing tables.

- POST: Creates a new table.

`/tables/:table_id/seat`

- PUT: Assigns a reservation to a table. Updates the status of the reservation to "seated" and updates the status of the table to "Occupied".

- DELETE: Removes the reservation from the table. Updates the status of the table to "Free" and the status of the reservation to "finished".

***

Frontend built using React.js and Bootstrap CSS.

Backend built using Express.js and Knex.js.







