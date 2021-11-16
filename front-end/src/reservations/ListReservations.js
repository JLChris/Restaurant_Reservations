import React from "react";
import { useHistory } from "react-router-dom";
import { previous, next } from "../utils/date-time";

function ListReservations({ reservations, date }) {
    const history = useHistory();

    return (
        <main>
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
                                <p data-reservation-id-status={r.reservation_id}>{r.status}</p>
                                {r.status === "booked" ?
                                    <a href={`/reservations/${r.reservation_id}/seat`}>
                                        <button
                                            type="button"
                                            className="btn btn-secondary">
                                            Seat
                                        </button>
                                    </a>
                                    : ""
                                }
                            </li>
                        )
                    })}
                </ol>
            }
            <div className="my-5">
                <button type="button" className="btn btn-secondary" onClick={() => history.push(`/dashboard?date=${previous(date)}`)}>Previous</button>
                <button type="button" className="btn btn-primary" onClick={() => history.push("/dashboard")}>Today</button>
                <button type="button" className="btn btn-secondary" onClick={() => history.push(`/dashboard?date=${next(date)}`)}>Next</button>
            </div>
        </main>
    )
}

export default ListReservations;