import React, { useState, useEffect, useCallback } from "react";
import {
  Pet,
  GetPetsQueryParams,
  GetPetsResponse,
  SortBy,
  Order
} from "./types";
import { API_URL } from "./constants";

import "./Table.scss";

const DEFAULT_PAGE_SIZE = 10;

const generateGetPetsEndpointUrl = (queryParams: GetPetsQueryParams) => {
  const searchParams = new URLSearchParams(
    Object.entries(queryParams).map(([key, value]) => {
      return [key, value.toString()];
    })
  );
  return `${API_URL}/pets?${searchParams.toString()}`;
};

type TableProps = {
  setSelectedPet: (petId: number) => Promise<void>;
};

const Table: React.FC<TableProps> = ({ setSelectedPet }) => {
  const [page, setPage] = useState<Pet[]>([]);
  const [total, setTotal] = useState(0);
  const [start, setStart] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_PAGE_SIZE);
  const [sortBy, setSortBy] = useState<SortBy>("id");
  const [order, setOrder] = useState<Order>("asc");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPets = useCallback(
    async (queryParams: GetPetsQueryParams) => {
      const endpointUrl = generateGetPetsEndpointUrl(queryParams);
      const resp = await fetch(endpointUrl);
      const { pets, total }: GetPetsResponse = await resp.json();

      setPage(pets);
      setTotal(total);
      if (loading) {
        setLoading(false);
      }
    },
    [loading]
  );

  useEffect(() => {
    fetchPets({ start, limit, sortBy, order, search });
  }, [start, limit, sortBy, order, search, fetchPets]);

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
      {loading ? (
        <span>Loading...</span>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={event => {
              // Reset on search
              setStart(0);
              setSearch(event.target.value);
            }}
          />
          {page.length === 0 ? (
            <p>No results found.</p>
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
                    page.map(pet => {
                      return (
                        <tr key={pet.id}>
                          <td>{pet.id}</td>
                          <td
                            onClick={async () => {
                              await setSelectedPet(pet.id);
                            }}
                          >
                            {pet.name}
                          </td>
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
              <div>
                <span>Page size</span>
                <select
                  value={limit}
                  onChange={event => {
                    setLimit(Number(event.target.value));
                  }}
                >
                  <option>5</option>
                  <option>10</option>
                  <option>25</option>
                </select>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Table;
