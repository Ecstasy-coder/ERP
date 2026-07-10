const authMiddleware = (req, res, next) => {
  req.user = req.user || null;

  if (req.headers.authorization) {
    req.user = { authorization: req.headers.authorization };
  }

  next();
};

module.exports = authMiddleware;