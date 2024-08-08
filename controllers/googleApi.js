import express from "express";
const router = express.Router();
import axios from "axios";
import { googleToken } from "./authorization.js";

//GOOGLE API ENDPOINTs
const googleApiURL = "https://www.googleapis.com/youtube/v3";
const playlistsEnpoint = "/playlists";

// ROUTES
router.get("/current-user-playlists", (req, res) => {
    console.log(googleToken);
    axios
        .get(googleApiURL + playlistsEnpoint, {
            headers: {
                Authorization: `Bearer ${googleToken}`,
            },
            params: {
                part: "snippet",
                mine: "true",
            },
        })
        .then((response) => {
            console.log(
                `Success, retrieved ${response.data.pageInfo.totalResults} results`
            );
            res.send(response.data);
        })
        .catch((error) => {
            console.error(error.message);
        });
});

export default router;
