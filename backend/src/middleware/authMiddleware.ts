import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {

        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "No token provided" });

        const token = authHeader.split(" ")[1];
        if (!token) return res.status(401).json({ message: "Invalid token format" });


        const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretKey");
        (req as any).user = decoded;

        next();
    } catch (err) {
        res.status(403).json({ message: "Token invalid or expired", error: err });
    }
};
