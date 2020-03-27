export type Pet = {
  id: number;
  name: string;
  age: string;
  weight: string;
};

export type GetPetsResponse = {
  pets: Pet[];
  total: number;
};

export type SortBy = keyof Pet;

export type Order = "asc" | "desc";

export type GetPetsQueryParams = {
  start: number;
  limit: number;
  sortBy: SortBy;
  order: Order;
  search: string;
};
