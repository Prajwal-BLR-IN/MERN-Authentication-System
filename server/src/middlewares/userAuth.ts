import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const userAuth = async (req: Request, res: Response, next: NextFunction) => {

    const {token} = req.cookies;

    if(!token) return res.status(401).json({ success: false, message: 'Not Authorized. Please login' });

    try {

        const jwtSecret = process.env.JWT_SECRET;

        if(!jwtSecret) throw new Error("JWT Secret is not stored in environment veriable")

        const tokenDecoded = jwt.verify(token, jwtSecret);

        if (typeof tokenDecoded === "object" && tokenDecoded !== null && "id" in tokenDecoded) {
            req.body.userID = tokenDecoded.id;
        }else{
            return res.status(401).json({success: false, message: "Not Authorized. Please login"})
        }

        next();
        
    } catch (error: any) {
        return res.status(500).json({ success: false, message: error.message });
    }


}

export default userAuth;