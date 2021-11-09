import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { listReservations } from "../utils/api";
import { previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";

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
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();
  let query = _useQuery();
  if (query.get("date")) {
    date = query.get("date");
  }

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservations.length === 0 ?
        <h5>There are no reservations for this date</h5> :
        <ol>
          {reservations.map(r => {
            return (
              <li key={r.reservation_id}>
                <p>{r.first_name} {r.last_name}</p>
                <p>Phone: {r.mobile_number}</p>
                <p>Reservation Time: {r.reservation_time}</p>
                <p>Party Size: {r.people}</p>
              </li>
            )
          })}
        </ol>
      }
      <div className="mt-5">
        <button type="button" className="btn btn-secondary" onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Previous</button>
        <button type="button" className="btn btn-primary" onClick={() => history.push("/dashboard")}>Today</button>
        <button type="button" className="btn btn-secondary" onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next</button>
      </div>
    </main>
  );
}

export default Dashboard;
