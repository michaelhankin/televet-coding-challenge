import { Pet } from "../types";
import petsJson from "./rawPets.json";

type PetMap = {
  [id: number]: Pick<Pet, "age" | "name" | "weight">;
};

const pets = petsJson.data.reduce((acc: PetMap, curr) => {
  const [id, name, weight, age] = curr as [number, string, string, string];

  acc[id] = { name, weight, age };

  return acc;
}, {});

export default pets;
