import { Request, Response, NextFunction } from "express";

export const isVerifiedClient = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const apiSecret = req.headers["api-secret"];

  if (apiSecret && apiSecret === process.env.API_SECRET) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized Action" });
  }
};
