import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function AddTable() {
    const history = useHistory();

    const initialFormState = {
        table_name: "",
        capacity: "",
    }

    const [table, setTable] = useState({ ...initialFormState });
    const [error, setError] = useState(null);

    const changeHandler = ({ target }) => {
        setTable({
            ...table,
            [target.name]: target.value,
        });
    };

    const cancelHandler = () => {
        history.goBack();
    }

    const submitHandler = (event) => {
        event.preventDefault();
        createTable(table)
            .then(() => {
                history.push("/dashboard");
            })
            .catch(setError);
    }

    return (
        <>
            <h1>Add New Table</h1>
            <ErrorAlert error={error} />
            <form onSubmit={submitHandler}>
                <div className="mb-3">
                    <label htmlFor="table_name" className="form-label">Table Name:</label>
                    <input
                        type="text"
                        name="table_name"
                        className="form-control"
                        id="table_name"
                        placeholder="#1"
                        minLength="2"
                        value={table.table_name}
                        onChange={changeHandler}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="capacity" className="form-label">capacity</label>
                    <input
                        type="number"
                        name="capacity"
                        className="form-control"
                        id="capacity"
                        placeholder="1"
                        min="1"
                        value={table.capacity}
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

export default AddTable;