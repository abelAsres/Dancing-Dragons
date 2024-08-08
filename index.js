import express from "express";
const app = express();
import cors from "cors";
import { authRouter } from "./controllers/authorization.js";
import spotify from "./controllers/spotifyApi.js";
import google from "./controllers/googleApi.js";

const port = 3000;

//Routes
app.use("/authorization", authRouter);
app.use("/spotify", spotify);
app.use("/google", google);

// Middlewares
app.use(cors());

app.get("/", (req, res) => {
    res.send({ msg: "You've reached Spotify Express" });
});

app.listen(port, () => {
    console.log(`Spotify Express is running on @ localhost:${port}`);
});
