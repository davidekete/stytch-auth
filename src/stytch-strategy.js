import { authenticateMagicLink, authenticateSessionJWT } from "./stytch-auth";

const Strategy = require("passport-strategy");
({
  authenticateMagicLink,
  authenticateSessionJWT,
  loginOrCreate,
} = require("./stytch-auth"));

export default class StytchStrategy extends Strategy {
  constructor() {
    super();

    // Set the default name of your strategy
    this.name = "stytch-strategy";
  }

  authenticate(req, options) {
    if (options.authenticateToken) {
      const token = req.query.token;

      if (!token) {
        this.error("Token missing from query params");
      }

      authenticateMagicLink(token, req)
        .then((response) => {
          this.success(response);
        })
        .catch((error) => this.error(error));
    } else if (options.authenticateSession) {
      const session = req.session.user;

      authenticateSessionJWT(session)
        .then((response) => {
          this.success(response);
        })
        .catch((error) => this.error(error));
    } else {
      this.error("No options provided");
    }
  }
}
