import passport from "passport";

export const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (!user || err) {
      res.status(401);
      next(new Error("Not authorized"));
    }
    req.user = user;
    next();
  })(req, res, next);
};
