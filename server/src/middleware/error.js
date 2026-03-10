function notFound(_req, res) {
  res.status(404).json({ message: "Not Found" });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, _req, res, _next) {
  const status = Number(err.status || 500);
  const message = err.message || "Server Error";
  res.status(status).json({ message });
}

module.exports = { notFound, errorHandler };

