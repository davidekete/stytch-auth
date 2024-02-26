require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;
const expressSession = require("express-session");
const authRouter = require("./src/authRoutes");
const passportCustom = require("passport-custom");
const StytchStrategy = passportCustom.Strategy;
const passport = require("passport");
const { authenticateSessionJWT } = require("./src/stytch-auth");
const cookieParser = require("cookie-parser");

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
passport.use(
  "stytch-strategy",
  new StytchStrategy(async function (req, done) {
    try {
      //try to retrieve sessionToken from the session object
      const sessionJWT =
        req.session?.session_jwt || req.session?.passport?.user?.session_jwt;

      // If session token is missing, return an error indicating invalid or missing session
      if (!sessionJWT) {
        return done(null, false, {
          message: "Session token is missing. Please Login",
        });
      }

      //Authenticate the session token
      const response = await authenticateSessionJWT(sessionJWT);

      // If the session token is valid, return the user data
      return done(null, response);
    } catch (error) {
      return done(null, false, { message: "Invalid session", error });
    }
  })
);

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
