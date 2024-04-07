import { Request, Response, NextFunction } from "express";

import jwt, {Secret} from "jsonwebtoken";

export const isAuthenticated = (req: Request, res:Response, next: NextFunction) => {
  const token = req.cookies.auth_token;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET as Secret, (err: any) => {
      if (err) {
        console.log(err);
        return res.status(401).send("Unauthorized Action");
      }
      next();
    });
  } else {
    res.status(401).json({ error: "Unauthorized Action" });
  }
};

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
