const errorHandler = (err, req, res, next) => {
  console.error("ERROR:", err.stack || err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined
  });
};

export default errorHandler;
