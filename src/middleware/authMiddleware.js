const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token = req.headers.authorization;

  // Check if token exists in the Authorization header
  if (!token || !token.startsWith('Bearer ')) {
    res.status(401);
    throw new Error("Not authorized, no token or invalid token format");
  }

  try {
    // Extract token from the Authorization header (after 'Bearer ')
    token = token.split(' ')[1];

    // Verify the token and decode it
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // Attach the decoded user data (id) to the request object
    req.user = { id: decoded.id };  // Assuming 'id' is in the payload of the token

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
};

module.exports = { protect };