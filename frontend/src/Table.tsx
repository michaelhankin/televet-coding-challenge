import React, { useState, useEffect } from "react";
import {
  Pet,
  GetPetsQueryParams,
  GetPetsResponse,
  SortBy,
  Order
} from "./types";

import "./Table.scss";

const DEFAULT_PAGE_SIZE = 10;
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
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState<SortBy>("id");
  const [order, setOrder] = useState<Order>("asc");
  const [search, setSearch] = useState("");

  const fetchPets = async (queryParams: GetPetsQueryParams) => {
    const endpointUrl = generateGetPetsEndpointUrl(queryParams);
    const resp = await fetch(endpointUrl);
    const { pets, total }: GetPetsResponse = await resp.json();

    setPage(pets);
    setTotal(total);
  };

  useEffect(() => {
    fetchPets({ start, limit, sortBy, order, search });
  }, [start, limit, sortBy, order, search]);

  const nextPage = () => {
    setStart(prevStart => {
      return prevStart + limit;
    });
  };

  const prevPage = () => {
    setStart(prevStart => {
      return prevStart - limit;
    });
  };

  const handleSort = (newSortBy: SortBy) => {
    if (sortBy === newSortBy) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      // Default to asc
      setOrder("asc");
    }
  };

  return (
    <div>
      {page.length === 0 ? (
        <span>Loading...</span>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th
                  onClick={() => {
                    handleSort("id");
                  }}
                  className={
                    sortBy === "id"
                      ? order === "asc"
                        ? "col-selected-asc"
                        : "col-selected-desc"
                      : ""
                  }
                >
                  ID
                </th>
                <th
                  onClick={() => {
                    handleSort("name");
                  }}
                  className={
                    sortBy === "name"
                      ? order === "asc"
                        ? "col-selected-asc"
                        : "col-selected-desc"
                      : ""
                  }
                >
                  Name
                </th>
              </tr>
            </thead>
            <tbody>
              {page.length === 0 ? (
                <tr>
                  <td>Loading...</td>
                </tr>
              ) : (
                page.map(item => {
                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          <button
            disabled={start === 0}
            onClick={() => {
              prevPage();
            }}
          >
            Previous Page
          </button>
          <button
            disabled={start + limit >= total}
            onClick={() => {
              nextPage();
            }}
          >
            Next Page
          </button>
        </>
      )}
    </div>
  );
};

export default Table;
