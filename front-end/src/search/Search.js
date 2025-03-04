import React, { useState } from "react";

import { listReservations } from "../utils/api";
import ListReservations from "../reservations/ListReservations";
import ErrorAlert from "../layout/ErrorAlert";

function Search() {
    const [mobile_number, setMobile_number] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [reservations, setReservations] = useState([]);

    const changeHandler = ({ target }) => {
        setMobile_number(target.value);
    };

    const submitHandler = (event) => {
        event.preventDefault();
        setSubmitted(true);
        listReservations({ mobile_number })
            .then(setReservations)
            .catch(setError);
    }

    return (
        <>
            <h1 className="mb-3">Search</h1>
            <form onSubmit={submitHandler} className="mb-5">
                <div className="row mb-3">
                    <div className="col-sm-10">
                        <input
                            type="tel"
                            name="mobile_number"
                            className="form-control w-25"
                            id="mobile_number"
                            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                            placeholder="Enter a customer's phone number"
                            value={mobile_number}
                            onChange={changeHandler}
                            required
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Find</button>
            </form>
            <ErrorAlert error={error} />
            {submitted
                ? <ListReservations reservations={reservations} />
                : ""
            }

        </>
    )
}

export default Search;