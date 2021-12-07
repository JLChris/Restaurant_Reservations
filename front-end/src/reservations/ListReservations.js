import React from "react";
import { updateReservationStatus } from "../utils/api";
import { useHistory } from "react-router-dom";

function ListReservations({ reservations }) {
    const history = useHistory();

    const cancelReservation = (resId) => {
        const message = "Do you want to cancel this reservation? This cannot be undone.";
        const response = window.confirm(message);
        if (response) {
            updateReservationStatus(resId, "cancelled")
                .then(() => {
                    history.go();
                })
                .catch(console.log);
        }
    }

    return (
        <main>
            {reservations.length === 0 ?
                <h5>No reservations found</h5> :
                <ol>
                    {reservations.map(r => {
                        return (
                            <li key={r.reservation_id} className="mb-3">
                                <div className="card w-50 border-dark">
                                    <div className="card-header">{r.first_name} {r.last_name}</div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">Phone: {r.mobile_number}</li>
                                        <li className="list-group-item">Reservation Time: {r.reservation_time}</li>
                                        <li className="list-group-item">Party Size: {r.people}</li>
                                        <li className="list-group-item" data-reservation-id-status={r.reservation_id}>{r.status}</li>
                                    </ul>
                                    {r.status === "booked" ?
                                        <div className="card-footer">
                                            <a href={`/reservations/${r.reservation_id}/seat`} className="mx-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary">
                                                    Seat
                                                </button>
                                            </a>
                                            <a href={`/reservations/${r.reservation_id}/edit`} className="mx-2">
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary">
                                                    Edit
                                                </button>
                                            </a>
                                            <button
                                                type="button"
                                                className="btn btn-danger mx-2"
                                                data-reservation-id-cancel={r.reservation_id}
                                                onClick={() => cancelReservation(r.reservation_id)}
                                            >Cancel</button>
                                        </div>
                                        : ""
                                    }
                                </div>
                            </li>
                        )
                    })}
                </ol>
            }
        </main>
    )
}

export default ListReservations;