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

export type GetPetsQueryParams = {
  start: number;
  limit: number;
  sortBy: keyof Pet;
  order: "asc" | "desc";
  search: string;
};
