import { app } from "../index.js";
import supertest from "supertest";

describe("GET /", () => {
    it("should respond with message You've reached Dancing Dragons", async () => {
        const res = await supertest(app).get("/").expect(200);
        expect(res.body.msg).toBe("You've reached Dancing Dragons!");
    });
});
