const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.http_code && err.message) {
    return res.status(err.http_code).json({
      message: err.message,
    });
  }

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    return res.status(400).json({ message: `That ${field} is already taken.` });
  }

  if (err.name === "MulterError" || err.status === 400) {
    return res.status(400).json({
      message: err.code === "LIMIT_FILE_SIZE"
        ? "Image must be 5 MB or smaller."
        : err.message,
    });
  }

  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on the server.",
  });
};

const notFound = (req, res) => {
  res.status(404).json({ message: "Route not found." });
};


module.exports = { errorHandler, notFound };
