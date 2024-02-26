const passportCustom = require("passport-custom");
const { authenticateSessionJWT } = require("./stytch-auth");
const CustomStrategy = passportCustom.Strategy;


const StytchStrategy = new CustomStrategy(async function (req, done) {
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
});

module.exports = StytchStrategy;