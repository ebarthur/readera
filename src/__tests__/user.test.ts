import * as user from "../handlers/user";

describe("user handler", () => {
	it("should create a new user", async () => {
		const req = {
			body: { username: "hello", email: "test@example.com", password: "world" },
		};
		const res = {
			json: jest.fn().mockImplementation((response) => {
				expect(response).toEqual({ message: "email already exists" });
			}),
			status: jest.fn().mockImplementation(function (code) {
				this.statusCode = code;
				return this;
			}),
		};
		await user.createUser(req, res);
	});

	it("should log in a user", async () => {
		const req = {
			body: { username: "hello", password: "world" },
		};
		const res = {
			json: jest.fn().mockImplementation((response) => {
				expect(response).toEqual({ message: "login successful" });
			}),
			status: jest.fn().mockImplementation(function (code) {
				this.statusCode = code;
				return this;
			}),
			cookie: jest.fn(),
		};

		await user.Login(req, res, () => {});
	});
});
