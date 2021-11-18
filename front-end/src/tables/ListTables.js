import React from "react";
import { updateTable, updateReservation, listTables } from "../utils/api";
import { useHistory } from "react-router-dom";

function ListTables({ tables, reservations }) {
    const history = useHistory();

    const finishTable = (table) => {
        const reservation = reservations.find(r => table.reservation_id === r.reservation_id);
        const message = "Is this table ready to seat new guests? This cannot be undone.";
        const response = window.confirm(message);
        if (response) {
            updateTable(table.table_id, { reservation_id: null, status: "Free" })
                .then(() => {
                    updateReservation(reservation.reservation_id, { status: "finished" });
                })
                .then(() => {
                    history.go();
                })
                .catch(console.log);
        }
    }

    return (
        <main>
            {tables.length === 0 ? "" :
                <ul>
                    {tables.map(t => {
                        return (
                            <li key={t.table_id} className="mb-3">
                                <p>{t.table_name} - <span data-table-id-status={t.table_id}>{t.status}</span> </p>
                                {t.status === "Occupied"
                                    ? <button
                                        type="button"
                                        className="btn btn-secondary"
                                        data-table-id-finish={t.table_id}
                                        onClick={() => {
                                            finishTable(t)
                                        }}
                                    >Finish</button>
                                    : ""
                                }
                            </li>
                        )
                    })}
                </ul>
            }
        </main>
    )
}

export default ListTables;