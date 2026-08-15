export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message || 'Server Error';

  console.error('[Error Middleware]:', err);

  // Mongoose Bad ObjectId
  if (err.name === 'CastError') {
    error.message = `Resource not found with id ${err.value}`;
    return res.status(404).json({
      success: false,
      message: error.message,
      error: err.name,
    });
  }

  // Mongoose Duplicate Key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error.message = `Duplicate value entered for ${field}.`;
    return res.status(400).json({
      success: false,
      message: error.message,
      error: err.code,
    });
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    return res.status(400).json({
      success: false,
      message,
      error: err.name,
    });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: error.message,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};
