import React, { useMemo, useState, useEffect } from "react";
import { Pet, GetPetsQueryParams, GetPetsResponse } from "./types";

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

  return (
    <div>
      <table>
        <thead>
          <th>ID</th>
          <th>Name</th>
        </thead>
        <tbody>
          {loading ? (
            <span>Loading...</span>
          ) : (
            page.map(item => {
              return (
                <tr>
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
    </div>
  );
};

export default Table;
