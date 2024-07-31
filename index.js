import express from "express";
const app = express();
import cors from "cors";
import authorization from "./controllers/authorization.js";
const port = 3000;

//Routes
app.use("/authorization", authorization);

// Middlewares
app.use(cors());

app.get("/", (req, res) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.send({ msg: "You've reached Spotify Express" });
});

app.listen(port, () => {
  console.log(`Spotify Express is running on @ localhost:${port}`);
});
