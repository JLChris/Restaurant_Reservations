import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import Form from "./Form";

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
        reservation.people = Number(reservation.people);
        createReservation({ ...reservation, status: "booked" })
            .then(() => {
                history.push(`/dashboard?date=${reservation.reservation_date}`);
            })
            .catch(setError);
    }

    return (
        <>
            <h1>Create Reservation</h1>
            <ErrorAlert error={error} />
            <Form
                submitHandler={submitHandler}
                formData={reservation}
                changeHandler={changeHandler}
                cancelHandler={cancelHandler}
            />
        </>
    )
}


export default NewReservation;