import createHttpError from "http-errors";

export const notFound = (req, res, next) => {
  next(createHttpError(404));
};

export const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
};


