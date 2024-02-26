const express = require("express");
const router = express.Router();
const {
  authenticateMagicLink,
  loginOrCreate,
  getUserData,
} = require("./stytch-auth");
const passport = require("passport");

router.post("/login-or-create", async (req, res) => {
  const email = req.body.email;

  const response = await loginOrCreate(email);

  res.send(response);
});

router.get("/authenticate", async (req, res) => {
  const token = req.query.token;

  const response = await authenticateMagicLink(token, req);

  res.send(response);
});

router.get(
  "/user-data",
  passport.authenticate("stytch-strategy"),
  async (req, res) => {
    const userId = req.user.session.user_id;

    const userData = await getUserData(userId);

    res.send(userData);
  }
);

module.exports = router;
