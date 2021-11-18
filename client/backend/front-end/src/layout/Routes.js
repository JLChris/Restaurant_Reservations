import React, { useState, useEffect } from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservation from "../reservations/NewReservation";
import AddTable from "../tables/AddTable";
import SeatReservation from "../reservations/SeatReservation";
import { listTables } from "../utils/api";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  // const [tables, setTables] = useState([]);
  // const [tablesError, setTablesError] = useState(null);

  // useEffect(() => {
  //   const abortController = new AbortController();
  //   setTablesError(null);
  //   listTables(abortController.signal)
  //     .then(setTables)
  //     .catch(setTablesError);
  //   return () => abortController.abort();
  // }, []);


  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <Dashboard date={today()} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={today()} />
      </Route>
      <Route path="/reservations/new">
        <NewReservation />
      </Route>
      <Route path="/tables/new">
        <AddTable />
      </Route>

      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
