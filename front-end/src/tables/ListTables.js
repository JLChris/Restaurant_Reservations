import React from "react";

function ListTables({ tables }) {
    return (
        <main>
            {tables.length === 0 ? "" :
                <ul>
                    {tables.map(t => {
                        return (
                            <li key={t.table_id}>
                                <p>{t.table_name} - <span data-table-id-status={t.table_id}>{t.status}</span> </p>
                            </li>
                        )
                    })}
                </ul>
            }
        </main>
    )
}

export default ListTables;