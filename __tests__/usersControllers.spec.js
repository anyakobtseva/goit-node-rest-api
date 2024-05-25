import { jest } from "@jest/globals";
import bcrypt from "bcrypt";
import { Users } from "../db/users";
import { loginUser } from "../controllers/usersControllers";

const testUser = {
  email: "user@test.com",
  password: "hashedPassword",
  subscription: "starter",
  avatarUrl: "testUrl",
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

describe("User Controller tests", () => {
    test("login returns 200, token and user", async () => {
      const hashedPass = await bcrypt.hash(testUser.password, 10);

      jest.spyOn(Users, "findOne").mockResolvedValueOnce({
        ...testUser,
        password: hashedPass,
      });

      jest
        .spyOn(Users, "findOneAndUpdate")
        .mockResolvedValueOnce({ ...testUser });
      const userReq = {
        body: {
          email: testUser.email,
          password: testUser.password,
        },
      };
      const res = mockResponse();
      await loginUser(userReq, res, jest.fn());
      expect(res.status).toBeCalledWith(200);
      const response = res.send.mock.lastCall[0];
      const userInResponse = response.user;
      expect(response.token).not.toBeUndefined();
      expect(userInResponse).not.toBeUndefined();
      expect(typeof userInResponse.email).toBe("string");
      expect(typeof userInResponse.subscription).toBe("string");
    });
    afterEach(() => {
      jest.clearAllMocks();
    });
});
