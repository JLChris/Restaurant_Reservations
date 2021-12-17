import React, { useEffect, useState } from "react";
import { useLocation, useHistory, Route, Switch } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import { next, previous } from "../utils/date-time";
import ListReservations from "../reservations/ListReservations";
import ListTables from "../tables/ListTables";
import ErrorAlert from "../layout/ErrorAlert";
import SeatReservation from "../reservations/SeatReservation";
import EditReservation from "../reservations/EditReservation";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function _useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

function Dashboard({ date }) {
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const query = _useQuery();

  if (query.get("date")) {
    date = query.get("date");
  }

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <Switch>
      <Route exact={true} path="/dashboard">
        <main>
          <h1>Dashboard</h1>
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">Reservations for date: {date}</h4>
          </div>
          <ErrorAlert error={reservationsError} />
          <ListReservations reservations={reservations} loadDashboard={loadDashboard} />
          <div className="my-5">
            <button type="button" className="btn btn-secondary mx-2" onClick={() => history.push(`/dashboard?date=${previous(date)}`)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-minus" viewBox="0 0 16 16">
              <path d="M5.5 9.5A.5.5 0 0 1 6 9h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z" />
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
            </svg></button>
            <button type="button" className="btn btn-primary mx-2" onClick={() => history.push("/dashboard")}>Today</button>
            <button type="button" className="btn btn-secondary mx-2" onClick={() => history.push(`/dashboard?date=${next(date)}`)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-calendar-plus" viewBox="0 0 16 16">
              <path d="M8 7a.5.5 0 0 1 .5.5V9H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V10H6a.5.5 0 0 1 0-1h1.5V7.5A.5.5 0 0 1 8 7z" />
              <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z" />
            </svg></button>
          </div>
          <ErrorAlert error={tablesError} />
          <ListTables tables={tables} loadDashboard={loadDashboard} setTablesError={setTablesError} />
        </main>
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation tables={tables} loadDashboard={loadDashboard} />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation loadDashboard={loadDashboard} />
      </Route>
    </Switch>

  );
}

export default Dashboard;
