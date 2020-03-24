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
  const offset = Number(req.query.offset) || 10;

  const sortedPets = Object.entries(pets)
    .map(([id, { name, weight, age }]) => {
      return { id: Number(id), name, weight, age };
    })
    .sort((petA, petB) => {
      if (petA.id < petB.id) {
        return -1;
      } else if (petA.id > petB.id) {
        return 1;
      }
      return 0;
    });

  const page = sortedPets.slice(start, start + offset);

  res.send({
    pets: page
  });
};

router.get("/pet/:id", getPet).get("/pets", getPets);

export default router;
