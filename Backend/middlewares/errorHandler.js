const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  const response = {
    success: false,
    msg: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  // Display error in the terminal for debugging
  console.error(`[Error]: ${err.message}`, err);

  res.status(err.statusCode).json(response);
};

export default errorHandler;
