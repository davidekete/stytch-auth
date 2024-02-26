require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const expressSession = require("express-session");
const authRouter = require("./src/authRoutes");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const StytchStrategy = require("./src/stytch-strategy");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);

// Define the Stytch strategy
passport.use("stytch-strategy", StytchStrategy);

// Initialize passport
app.use(passport.initialize());
// Use the express session
app.use(passport.session());

// Serialize and deserialize the user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Use the authRouter
app.use(authRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
