import express from "express";
import router from "./routes";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(router);

app.listen(port, () => console.info(`Pets API listening on port ${port}!`));
