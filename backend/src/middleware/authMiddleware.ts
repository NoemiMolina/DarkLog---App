import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
    id: string;
    iat: number;
    exp: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("🔐 Auth headers:", req.headers.authorization);

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            console.log("❌ No auth header");
            return res.status(401).json({ message: "No token provided" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            console.log("❌ Invalid token format");
            return res.status(401).json({ message: "Invalid token format" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretKey") as JwtPayload;
        console.log("✅ Token decoded:", decoded);

        (req as any).user = decoded;
        (req as any).userId = decoded.id;

        next();
    } catch (err) {
        console.error("❌ Token verification failed:", err);
        res.status(403).json({ message: "Token invalid or expired", error: String(err) });
    }
};