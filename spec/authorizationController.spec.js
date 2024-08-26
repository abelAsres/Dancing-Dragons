import { app } from "../index.js";
import * as auth from "../controllers/authorization.controller.js";
import supertest from "supertest";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";

describe("GET /authorization", () => {
    it("should redirect to spotify api", () => {
        supertest(app)
            .get("/authorization")
            .then((res) => {
                expect(res.status).toBe(302);
            });
    });
});

describe("GET /get-spotify-token", () => {
    let mockAxios = new MockAdapter(axios);

    it("should have a null state", () => {
        supertest(app)
            .get("/authorization/get-spotify-token")
            .then((res) => {
                expect(res.status).toBe(400);
                expect(res.body).toBe("state is null");
            });
    });

    it("should retrieve a token from spotify", () => {
        //mock axios call to spotify
        mockAxios
            .onPost("https://accounts.spotify.com/api/token", {
                params: {
                    code: "testingCode",
                    state: "testingState",
                    redirect_uri:
                        "http://localhost:3000/authorization/get-spotify-token",
                },
            })
            .reply(302, {
                access_token: "testToken",
                refresh_token: "testRefreshToken",
            });

        supertest(app)
            .get(
                "/authorization/get-spotify-token?code='testingCode'&state='testingState'"
            )
            .then((res) => {
                expect(res.status).toBe(302);
                expect(auth.getToken).toHaveBeenCalledWith("testingCode");
                expect(res.data.access_token).toBe("testToken");
                expect(res.data.refresh_token).toBe("testRefreshToken");
            });
    });
});
