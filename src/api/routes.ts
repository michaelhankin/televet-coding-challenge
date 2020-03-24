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

router.get("/pet/:id", getPet);

export default router;
