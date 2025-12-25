import jwt from 'jsonwebtoken'
import { EnvConfig } from "../config/EnvConfig.js";

const JWT_SECRETE = EnvConfig.JWT_SECRETE;
export const tokenVerifier = async (req, res, next) => {
    const authToken = req.header("Authorization");

    

    if (!authToken) {
        return res
          .status(400)
          .json({ success:false, message: "Invalid Authentication Token" });
    }

    try {
        const token = authToken.split("Bearer ")[1];
        const verifyTokens = jwt.verify(token, JWT_SECRETE); 
        req.user_id = verifyTokens.foo

        next()
    } catch (error) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Authentication Token" });
    }
}