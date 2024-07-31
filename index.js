import express from "express";
const app = express();
import cors from "cors";
import authorization from "./controllers/authorization.js";
const port = 3000;

//SPOTIFY WEB API
const spotifyWebAPIURL = "https://accounts.spotify.com";
const authorizationEndpoint = "/authorize?";
const getTokenEndpoint = "/api/token";
const getRefreshTokenEndpoint = "/refresh_token";
const clientId = "d673f63e82c74f87a19296161952b27c";
const client_secret = "273dcd4bfcf740fe9e5c54bbf17b9795";
const redirectUri = "http://localhost:3000/get-token";
const scope = "user-read-private user-read-email";
const state = "dancingDragons";
let accessToken = "";
let refreshToken = "";

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

// app.get("/get-authorization", (req, res) => {
//   console.log("Start /get-authorization");

//   let urlSearchParams = new URLSearchParams();
//   urlSearchParams.append("client_id", clientId);
//   urlSearchParams.append("redirect_uri", redirectUri);
//   urlSearchParams.append("response_type", "code");
//   urlSearchParams.append("scope", scope);
//   urlSearchParams.append("state", state);

//   res.redirect(
//     spotifyWebAPIURL + authorizationEndpoint + urlSearchParams.toString()
//   );
//   console.log("Complete /get-authorization");
// });

// app.get("/get-token", (req, res) => {
//   console.log("Start /get-token");
//   let code = req.query.code || null;
//   let state = req.query.state || null;

//   if (state === null) {
//     console.log("state is null");
//   } else {
//     axios
//       .post(spotifyWebAPIURL + getTokenEndpoint, null, {
//         headers: {
//           "content-type": "application/x-www-form-urlencoded",
//           Authorization:
//             "Basic " +
//             new Buffer.from(clientId + ":" + client_secret).toString("base64"),
//         },
//         params: {
//           code: code,
//           redirect_uri: redirectUri,
//           grant_type: "authorization_code",
//         },
//       })
//       .then((response) => {
//         accessToken = response.data.access_token;
//         refreshToken = response.data.refresh_token;

//         console.log("Access Token: ", accessToken);
//         console.log("Refresh Token: ", refreshToken);
//       })
//       .catch((error) => {
//         console.error(error.message);
//         axios
//           .post(spotifyWebAPIURL + getRefreshTokenEndpoint, null, {
//             headers: {
//               "content-type": "application/x-www-form-urlencoded",
//               Authorization:
//                 "Basic " +
//                 new Buffer.from(clientId + ":" + client_secret).toString(
//                   "base64"
//                 ),
//             },
//             params: {
//               refresh_token: refreshToken,
//               grant_type: "refresh_token",
//             },
//           })
//           .then((response) => {
//             accessToken = response.data.access_token;
//             refreshToken = response.data.refresh_token;

//             console.log("New Access Token: ", accessToken);
//             console.log("New Refresh Token: ", refreshToken);
//           });
//       });
//   }
//   console.log("Complete /get-token");
// });

// app.post("/get-token", jsonParser, async (req, res) => {
//   const spotifyData = req.body;

//   console.log(spotifyData);

//   const payload = {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded",
//     },
//     body: new URLSearchParams({
//       client_id: clientId,
//       grant_type: "authorization_code",
//       code: spotifyData.code,
//       redirect_uri: spotifyData.redirect_uri,
//       code_verifier: spotifyData.codeVerifier,
//     }),
//   };

//   console.log("Payload: ", payload);

//   const url = "https://accounts.spotify.com/api/token";

//   const body = await fetch(url, payload);

//   const response = await body.json();

//   console.log("RESPONSE: ", response);
//   //axios.post('https://accounts.spotify.com/api/token', spotifyData)

//   //https://accounts.spotify.com/api/token

//   // const options = {
//   //   hostname: "accounts.spotify.com",
//   //   path: "/api/token",
//   //   method: "POST",
//   //   "Content-Type": "application/x-www-form-urlencoded",
//   // };

//   // const request = https.request(options, (res) => {
//   //   console.log("REQUEST IN PROCESS");
//   //   res.on("data", (chunk) => {
//   //     data += chunk;
//   //   });

//   //   res.on("end", () => {
//   //     console.log("DATA:", data);
//   //   });
//   // });

//   // request.on("error", (e) => {
//   //   console.error(`Problem with request: ${e.message}`);
//   // });
// });

// function generateRandomString(length) {
//   const possible =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   const values = crypto.getRandomValues(new Uint8Array(length));
//   return values.reduce((acc, x) => acc + possible[x % possible.length], "");
// }

// function sha256(plain) {
//   const encoder = new TextEncoder();
//   const data = encoder.encode(plain);
//   return crypto.subtle.digest("SHA-256", data);
// }

// function base64encode(input) {
//   return btoa(String.fromCharCode(...new Uint8Array(input)))
//     .replace(/=/g, "")
//     .replace(/\+/g, "-")
//     .replace(/\//g, "_");
// }
