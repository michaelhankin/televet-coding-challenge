import React, { useMemo, useState, useEffect } from "react";
import { useTable } from "react-table";
import { Pet, GetPetsQueryParams, GetPetsResponse } from "./types";

import "./Table.scss";

const PAGE_SIZE = 10;
const ENDPOINT_URL = "http://localhost:8000/pets";

const generateGetPetsEndpointUrl = (queryParams: GetPetsQueryParams) => {
  const searchParams = new URLSearchParams(
    Object.entries(queryParams).map(([key, value]) => {
      return [key, value.toString()];
    })
  );
  return `${ENDPOINT_URL}?${searchParams.toString()}`;
};

const Table: React.FC = () => {
  const [page, setPage] = useState<Pet[]>([]);
  const [total, setTotal] = useState(0);
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [sortBy, setSortBy] = useState<keyof Pet>("id");
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPets = async (queryParams: GetPetsQueryParams) => {
    setLoading(true);
    const endpointUrl = generateGetPetsEndpointUrl(queryParams);
    const resp = await fetch(endpointUrl);
    const { pets, total }: GetPetsResponse = await resp.json();

    setPage(pets);
    setTotal(total);
    setLoading(false);
  };

  useEffect(() => {
    fetchPets({ start, limit, sortBy, order, search });
  }, [start, limit, sortBy, order, search]);

  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id"
      },
      {
        Header: "Name",
        accessor: "name"
      }
    ],
    []
  );
  const {
    getTableProps,
    getTableBodyProps,
    headers,
    rows,
    prepareRow
  } = useTable({ columns, data: page });

  return (
    <div>
      <table {...getTableProps()}>
        <thead>
          {headers.map(column => {
            return (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {loading ? (
            <span>Loading...</span>
          ) : (
            rows.map(row => {
              prepareRow(row);

              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      <button
        onClick={() => {
          // previousPage();
        }}
      >
        Previous Page
      </button>
      <button
        onClick={() => {
          // nextPage();
        }}
      >
        Next Page
      </button>
    </div>
  );
};

export default Table;
