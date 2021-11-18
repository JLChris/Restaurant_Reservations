import React from "react";


function ListReservations({ reservations }) {
    // const activeReservations = reservations.filter(r => r.status !== "finished");

    return (
        <main>
            {reservations.length === 0 ?
                <h5>No reservations found</h5> :
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
        </main>
    )
}

export default ListReservations;