import express from "express";
const router = express.Router();
import axios from "axios";
import { spotifyToken } from "./authorization.controller.js";
import { getSpotifyPlaylistTracks } from "../services/playlist.service.js";

const spotifyWebAPIURL = "https://api.spotify.com/v1";
const currentUserProfileEndpoint = "/me";

/*
TODO: 
1. create routes to edit: 
    - user playlists
*/

router.get("/current-user", (req, res) => {
    axios
        .get(spotifyWebAPIURL + currentUserProfileEndpoint, {
            headers: {
                Authorization: `Bearer ${spotifyToken}`,
            },
        })
        .then((response) => {
            console.log(
                `Success, retrieved ${response.data.display_name}'s profile`
            );
            res.send(response.data);
        })
        .catch((error) => {
            console.error(error.message);
        });
});

router.get("/users/:userId/playlists", (req, res) => {
    const userId = req.params.userId;
    axios
        .get(spotifyWebAPIURL + `/users/${userId}/playlists`, {
            headers: {
                Authorization: `Bearer ${spotifyToken}`,
            },
        })
        .then((response) => {
            console.log(
                `Success, retrieved ${response.data.display_name}'s profile`
            );
            res.send(response.data);
        })
        .catch((error) => {
            console.error(error.message);
        });
});

router.get("/playlists/:playlistId/tracks", (req, res) => {
    const playlistId = req.params.playlistId;
    axios
        .get(spotifyWebAPIURL + `/playlists/${playlistId}/tracks`, {
            headers: {
                Authorization: `Bearer ${spotifyToken}`,
            },
        })
        .then((response) => {
            console.log(
                `Success, retrieved ${response.data.items.length} tracks`
            );
            let tracks = getSpotifyPlaylistTracks(response.data.items);
            res.json(tracks);
        })
        .catch((error) => {
            console.error(error.message);
        });
});

export default router;
