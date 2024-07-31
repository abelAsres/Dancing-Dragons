import express from "express";
const router = express.Router();
import axios from "axios";

//Routes to get token for spotify api

//SPOTIFY WEB API
const spotifyWebAPIURL = "https://accounts.spotify.com";
const authorizationEndpoint = "/authorize?";
const getTokenEndpoint = "/api/token";
const getRefreshTokenEndpoint = "/refresh_token";
const clientId = "d673f63e82c74f87a19296161952b27c";
const client_secret = "273dcd4bfcf740fe9e5c54bbf17b9795";
const redirectUri = "http://localhost:3000/authorization/get-token";
const scope = "user-read-private user-read-email";
const state = "dancingDragons";
let accessToken = "";
let refreshToken = "";

/**GET AUTHORIZATION
 *
 */

router.get("/", (req, res) => {
  console.log("Start /get-authorization");

  let urlSearchParams = new URLSearchParams();
  urlSearchParams.append("client_id", clientId);
  urlSearchParams.append("redirect_uri", redirectUri);
  urlSearchParams.append("response_type", "code");
  urlSearchParams.append("scope", scope);
  urlSearchParams.append("state", state);

  res.redirect(
    spotifyWebAPIURL + authorizationEndpoint + urlSearchParams.toString()
  );
  console.log("Complete /get-authorization");
});

/**GET TOKEN
 *
 */
router.get("/get-token", (req, res) => {
  console.log("Start /get-token");
  let code = req.query.code || null;
  let state = req.query.state || null;

  if (state === null) {
    console.log("state is null");
  } else {
    axios
      .post(spotifyWebAPIURL + getTokenEndpoint, null, {
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            new Buffer.from(clientId + ":" + client_secret).toString("base64"),
        },
        params: {
          code: code,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        },
      })
      .then((response) => {
        accessToken = response.data.access_token;
        refreshToken = response.data.refresh_token;

        console.log("Access Token: ", accessToken);
        console.log("Refresh Token: ", refreshToken);
      })
      .catch((error) => {
        console.error(error.message);
        axios
          .post(spotifyWebAPIURL + getRefreshTokenEndpoint, null, {
            headers: {
              "content-type": "application/x-www-form-urlencoded",
              Authorization:
                "Basic " +
                new Buffer.from(clientId + ":" + client_secret).toString(
                  "base64"
                ),
            },
            params: {
              refresh_token: refreshToken,
              grant_type: "refresh_token",
            },
          })
          .then((response) => {
            accessToken = response.data.access_token;
            refreshToken = response.data.refresh_token;

            console.log("New Access Token: ", accessToken);
            console.log("New Refresh Token: ", refreshToken);
          });
      });
  }
  console.log("Complete /get-token");
});

export default router;
