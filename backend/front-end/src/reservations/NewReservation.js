import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function NewReservation() {
    const history = useHistory();

    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 1
    };
    const [reservation, setReservation] = useState({ ...initialFormState });
    const [error, setError] = useState(null);

    const changeHandler = ({ target }) => {
        setReservation({
            ...reservation,
            [target.name]: target.value,
        });
    };

    const cancelHandler = () => {
        history.goBack();
    }

    const submitHandler = (event) => {
        event.preventDefault();
        createReservation(reservation)
            .then(() => {
                history.push(`/dashboard?date=${reservation.reservation_date}`);
            })
            .catch(setError);
    }

    return (
        <>
            <h1>Create Reservation</h1>
            <ErrorAlert error={error} />
            <form onSubmit={submitHandler}>
                <div className="mb-3">
                    <label htmlFor="first_name" className="form-label">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        className="form-control"
                        id="first_name"
                        placeholder="John"
                        value={reservation.first_name}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="last_name" className="form-label">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        className="form-control"
                        id="last_name"
                        placeholder="Smith"
                        value={reservation.last_name}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="mobile_number" className="form-label">Mobile Number</label>
                    <input
                        type="tel"
                        name="mobile_number"
                        className="form-control"
                        id="mobile_number"
                        pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                        placeholder="xxx-xxx-xxxx"
                        value={reservation.mobile_number}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="reservation_date" className="form-label">Date of Reservation</label>
                    <input
                        type="date"
                        name="reservation_date"
                        className="form-control"
                        id="reservation_date"
                        pattern="\d{4}-\d{2}-\d{2}"
                        placeholder="YYYY-MM-DD"
                        value={reservation.reservation_date}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="reservation_time" className="form-label">Time of Reservation</label>
                    <input
                        type="time"
                        name="reservation_time"
                        className="form-control"
                        id="reservation_time"
                        pattern="[0-9]{2}:[0-9]{2}"
                        placeholder="HH:MM"
                        value={reservation.reservation_time}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="people" className="form-label">Party Size</label>
                    <input
                        type="number"
                        name="people"
                        className="form-control"
                        id="people"
                        min="1"
                        value={reservation.people}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div>
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <button type="button" className="btn btn-danger" onClick={cancelHandler}>Cancel</button>
                </div>
            </form>
        </>
    )
}


export default NewReservation;