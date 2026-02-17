import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  id: string;
  iat: number;
  exp: number;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Try to get token from Authorization header first (preferred)
    let token = req.headers.authorization?.split(" ")[1];
    
    // Fallback to cookie if no Authorization header (backwards compatibility)
    if (!token) {
      token = (req.cookies as any).token;
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secretKey",
    ) as JwtPayload;
    (req as any).user = decoded;
    (req as any).userId = decoded.id;

    next();
  } catch (err) {
    res
      .status(403)
      .json({ message: "Token invalid or expired", error: String(err) });
  }
};
