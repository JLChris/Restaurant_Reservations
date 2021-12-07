import React from "react";
import { deleteTable } from "../utils/api";
import { useHistory } from "react-router-dom";

function ListTables({ tables, loadDashboard }) {
    const history = useHistory();

    const finishTable = (tableId) => {
        const message = "Is this table ready to seat new guests? This cannot be undone.";
        const response = window.confirm(message);
        if (response) {
            deleteTable(tableId)
                .then(() => {
                    loadDashboard();
                })
                .catch(console.log);
        }
    }

    return (
        <main>
            <h4>Tables</h4>
            {tables.length === 0 ? "" :
                <ul>
                    {tables.map(t => {
                        return (
                            <li key={t.table_id} className="mb-3">
                                <p className="d-inline">{t.table_name} - <span data-table-id-status={t.table_id}>{t.status}</span> </p>
                                {t.status === "Occupied"
                                    ? <button
                                        type="button"
                                        className="btn btn-warning ml-2 py-0"
                                        data-table-id-finish={t.table_id}
                                        onClick={() => {
                                            finishTable(t.table_id)
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