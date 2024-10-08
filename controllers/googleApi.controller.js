import express from "express";
const router = express.Router();
import axios from "axios";
import { googleToken } from "./authorization.controller.js";

//GOOGLE API ENDPOINTs
const googleApiURL = "https://www.googleapis.com/youtube/v3";
const playlistsEnpoint = "/playlists";
const playlistItemsEndpoint = "/playlistItems";
const searchEndpoint = "/search";

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

router.post("/playlists", (req, res) => {
    let params = new URLSearchParams();
    params.append("part", "snippet");
    params.append("part", "status");

    axios
        .post(
            googleApiURL + playlistsEnpoint,
            {
                snippet: {
                    title: "Sample playlist created via API",
                    description: "This is a sample playlist description.",
                    tags: ["sample playlist", "API call"],
                    defaultLanguage: "en",
                },
                status: {
                    privacyStatus: "private",
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${googleToken}`,
                },
                params: params,
            }
        )
        .then((response) => {
            console.log(
                `Success, retrieved ${response.data.snippet.title} was created on ${response.data.snippet.channeltitle} channel`
            );
            res.send(response.data);
        })
        .catch((error) => {
            console.error(error.message);
            res.send(error);
        });
});

router.get("/search", (req, res) => {
    let params = new URLSearchParams();
    params.append("part", "snippet");
    params.append("q", req.body.search);

    axios
        .get(googleApiURL + searchEndpoint, {
            headers: {
                Authorization: `Bearer ${googleToken}`,
            },
            params: params,
        })
        .then((response) => {
            console.log(
                `Success, retrieved ${response.data.pageInfo.totalResults} results`
            );
            res.send(response.data);
        })
        .catch((error) => {
            console.error(error.message);
            res.send(error);
        });
});

router.post("/add-to-playlist", (req, res) => {
    let params = new URLSearchParams();
    params.append("part", "snippet");
    axios
        .post(
            googleApiURL + playlistItemsEndpoint,
            {
                snippet: {
                    playlistId: req.body.playlistId,
                    resourceId: {
                        kind: req.body.resourceId.kind,
                        videoId: req.body.resourceId.videoId,
                    },
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${googleToken}`,
                },
                params: params,
            }
        )
        .then((response) => {
            console.log(
                `Success, ${response.data.snippet.title} was added to playlist`
            );
            res.send(response.data);
        })
        .catch((error) => {
            console.error(error.message);
            res.send(error);
        });
});

export default router;
