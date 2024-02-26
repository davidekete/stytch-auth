const stytchClient = require("./stytch-config");

async function loginOrCreate(email) {
  try {
    const response = await stytchClient.magicLinks.email.loginOrCreate({
      email,
    });

    const message = `User ${
      response.user_created ? "invited successfully" : "login magic link sent"
    }`;

    return { message, response };
  } catch (error) {
    console.error(error);
  }
}

async function authenticateMagicLink(token, req) {
  try {
    const response = await stytchClient.magicLinks.authenticate({
      token,
      session_duration_minutes: "43200",
    });

    if (response.status_code === 200) {
      req.session.session_jwt = response.session_jwt;
    }

    return { message: "Token verified successfully", response };
  } catch (error) {
    throw error;
  }
}

async function authenticateSessionJWT(sessionJWT) {
  try {
    const response = await stytchClient.sessions.authenticateJwt({
      session_jwt: sessionJWT,
    });

    return response;
  } catch (error) {
    throw error;
  }
}

async function getUserData(userId) {
  try {
    const response = await stytchClient.users.get({ user_id: userId });

    return response;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  authenticateMagicLink,
  authenticateSessionJWT,
  loginOrCreate,
  getUserData,
};
