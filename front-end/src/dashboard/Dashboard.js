import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { listReservations } from "../utils/api";
import ListReservations from "../reservations/ListReservations";
import ListTables from "../tables/ListTables";
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

function Dashboard({ date, tables, tablesError }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const query = _useQuery();

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
      <ErrorAlert error={tablesError} />
      <ListReservations reservations={reservations} date={date} />
      <ListTables tables={tables} reservations={reservations} />
    </main>
  );
}

export default Dashboard;
