import passport from "passport";
import passportJWT from "passport-jwt";
import { getUserById } from "./services/usersService.js";
import "dotenv/config";
import jwt from "jsonwebtoken";
const secret = process.env.SECRET;

const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;
const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
};

// JWT Strategy
passport.use(
  new Strategy(params, async (payload, done) => {
    try {
      const user = await getUserById(payload.id);
      if (!user || jwt.sign(payload, secret) !== user.token) {
        return done(new Error("Not authorized"));
      }
      return done(null, user);
    } catch (err) {
      done(err, false);
    }
  })
);
