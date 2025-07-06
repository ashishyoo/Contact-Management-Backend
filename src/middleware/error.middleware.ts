import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode =
    res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  console.error("Error:", {
    message: err.message,
  });

  switch (statusCode) {
    case 400:
      res.status(400).json({ title: "Validation Error", message: err.message });
      break;
    case 401:
      res.status(401).json({ title: "Unauthorized", message: err.message });
      break;
    case 404:
      res.status(404).json({ title: "Not Found", message: err.message });
      break;
    case 409:
      res.status(409).json({ title: "Conflict", message: err.message });
      break;
    case 500:
      res.status(500).json({ title: "Server Error", message: err.message });
      break;
    default:
      res.status(statusCode).json({ title: "Error", message: err.message });
      break;
  }
};

export default errorHandler;
