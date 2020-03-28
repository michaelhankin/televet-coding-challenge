import express, { RequestHandler } from "express";
import pets from "./data/pets";

const router = express.Router();

const getPet: RequestHandler<{ id: string }> = (req, res) => {
  const id = Number(req.params.id);
  const pet = pets[id];

  if (!pet) {
    res.status(404).send("Pet not found.");
  } else {
    res.send({ id, ...pet });
  }
};

const getPets: RequestHandler<{}> = (req, res) => {
  const start = Number(req.query.start) || 0;
  if (
    start < 0 ||
    !Number.isInteger(start) ||
    (req.query.start && Number.isNaN(Number(req.query.start)))
  ) {
    res.status(400).send("Start index must be a positive integer");
    return;
  }
  if (start > Object.keys(pets).length - 1) {
    res.status(404).send("Start index out of bounds of current list of pets");
    return;
  }

  const limit = Number(req.query.limit) || 10;
  if (
    limit < 1 ||
    !Number.isInteger(limit) ||
    (req.query.limit && Number.isNaN(Number(req.query.limit)))
  ) {
    res.status(400).send("Limit must be an integer greater than or equal to 1");
    return;
  }

  const sortBy: "id" | "name" = req.query.sortBy || "id";
  if (!["id", "name"].includes(sortBy)) {
    res.status(400).send("sortBy must be one of: id, name");
    return;
  }

  const order: "asc" | "desc" = req.query.order || "asc";
  if (!["asc", "desc"].includes(order)) {
    res.status(400).send("order must be one of: asc, desc");
    return;
  }

  const search = req.query.search || "";
  if (!(typeof search === "string")) {
    res.status(400).send("search must be a string");
    return;
  }

  const filteredPets = Object.entries(pets)
    .map(([id, { name }]) => {
      return { id: Number(id), name };
    })
    .sort((petA, petB) => {
      if (petA[sortBy] < petB[sortBy]) {
        return order === "asc" ? -1 : 1;
      } else if (petA[sortBy] > petB[sortBy]) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    })
    .filter(pet => {
      return pet.name.includes(search);
    });

  const page = filteredPets.slice(start, start + limit);

  res.send({
    pets: page,
    total: filteredPets.length
  });
};

router.get("/pet/:id", getPet).get("/pets", getPets);

export default router;
