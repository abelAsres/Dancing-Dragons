import express from "express";
const router = express.Router();
import axios from "axios";
import "dotenv/config";
//GOOGLE API IMPORTS
import { google } from "googleapis";
import crypto from "crypto";
import session from "express-session";

//Routes to get token for spotify api

//SPOTIFY WEB API
const spotifyAuthAPIURL = "https://accounts.spotify.com";
const authorizationEndpoint = "/authorize?";
const getTokenEndpoint = "/api/token";
const getspotifyRefreshTokenEndpoint = "/refresh_token";
const redirectUri = "http://localhost:3000/authorization/get-spotify-token";
const scope = "user-read-private user-read-email";
const state = "dancingDragons";
let spotifyAccessToken = "";
let spotifyRefreshToken = "";
let googleAccessToken = "";
let googleRefreshToken = "";

//GOOGLE API
/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, process.env.SPOTIFYCLIENTSECRET, AND REDIRECT_URI
 * from the process.env.SPOTIFYCLIENTSECRET.json file. To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */
const oauth2Client = new google.auth.OAuth2(
    JSON.parse(process.env.GOOGLEAPISECRET).client_id,
    JSON.parse(process.env.GOOGLEAPISECRET).client_secret,
    JSON.parse(process.env.GOOGLEAPISECRET).redirect_uris[0]
);

// Access scopes for activity.
const scopes = [
    "https://www.googleapis.com/auth/youtube",
    "https://www.googleapis.com/auth/youtube.force-ssl",
];

// Generate a secure random state value.
const googleState = crypto.randomBytes(32).toString("hex");

const getToken = (code) => {
    return axios.post(spotifyAuthAPIURL + getTokenEndpoint, null, {
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            Authorization:
                "Basic " +
                new Buffer.from(
                    process.env.SPOTIFYCLIENTID +
                        ":" +
                        process.env.SPOTIFYCLIENTSECRET
                ).toString("base64"),
        },
        params: {
            code: code,
            redirect_uri: redirectUri,
            grant_type: "authorization_code",
        },
    });
};

const getspotifyRefreshToken = () => {
    return axios.post(
        spotifyAuthAPIURL + getspotifyRefreshTokenEndpoint,
        null,
        {
            headers: {
                "content-type": "application/x-www-form-urlencoded",
                Authorization:
                    "Basic " +
                    new Buffer.from(
                        process.env.SPOTIFYCLIENTID +
                            ":" +
                            process.env.SPOTIFYCLIENTSECRET
                    ).toString("base64"),
            },
            params: {
                refresh_token: spotifyRefreshToken,
                grant_type: "refresh_token",
            },
        }
    );
};

router.use(
    session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: false,
    })
);

/**GET AUTHORIZATION
 *
 */
router.get("/", (req, res) => {
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append("client_id", process.env.SPOTIFYCLIENTID);
    urlSearchParams.append("redirect_uri", redirectUri);
    urlSearchParams.append("response_type", "code");
    urlSearchParams.append("scope", scope);
    urlSearchParams.append("state", state);

    res.redirect(
        spotifyAuthAPIURL + authorizationEndpoint + urlSearchParams.toString()
    );
});

/**GET TOKEN
 *
 */
router.get("/get-spotify-token", (req, res) => {
    let code = req.query.code || null;
    let state = req.query.state || null;

    if (state === null) {
        res.status(400).json("state is null");
    } else {
        getToken(code)
            .then((response) => {
                spotifyAccessToken = response.data.access_token;
                spotifyRefreshToken = response.data.refresh_token;

                // console.log("Access Token: ", spotifyAccessToken);
                // console.log("Refresh Token: ", spotifyRefreshToken);
            })
            .catch((error) => {
                console.error(error.message);

                getspotifyRefreshToken().then((response) => {
                    spotifyAccessToken = response.data.access_token;
                    spotifyRefreshToken = response.data.refresh_token;

                    // console.log("New Access Token: ", spotifyAccessToken);
                    // console.log("New Refresh Token: ", spotifyRefreshToken);
                });
            });
    }
});

router.get("/google-auth", (req, res) => {
    // Store state in the session
    req.session.state = googleState;

    // Generate a url that asks permissions for the Drive activity scope
    const authorizationUrl = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: "offline",
        /** Pass in the scopes array defined above.
         * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
        scope: scopes,
        // Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes: true,
        // Include the state parameter to reduce the risk of CSRF attacks.
        state: googleState,
    });

    res.redirect(authorizationUrl);
});

router.get("/get-google-token", async (req, res) => {
    const code = req.query.code;

    if (req.query.error) {
        // An error response e.g. error=access_denied
        console.log("Error:" + req.query.error);
    } else if (req.query.state !== req.session.state) {
        //check state value
        console.log("State mismatch. Possible CSRF attack");
        res.end("State mismatch. Possible CSRF attack");
    } else {
        // Get access and refresh tokens (if access_type is offline)
        let { tokens } = await oauth2Client.getToken(code);
        // console.log(tokens);
        googleAccessToken = tokens.access_token;
        googleRefreshToken = tokens.refresh_token;
        oauth2Client.setCredentials(tokens);
    }
});

export {
    router as authRouter,
    spotifyAccessToken as spotifyToken,
    googleAccessToken as googleToken,
    getToken,
    getspotifyRefreshToken,
};
