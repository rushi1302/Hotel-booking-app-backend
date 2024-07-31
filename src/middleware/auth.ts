import { Request, Response, NextFunction } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import jwt from "jsonwebtoken";
import User from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      auth0Id: string;
    }
  }
}

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH_ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});

export const jwtParse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not Authorized" });
  }
  const token = authorization.split(" ")[1];

  try {
    const decode = jwt.decode(token) as jwt.JwtPayload;
    const auth0Id = decode.sub;

    const user = await User.findOne({ auth0Id });
    if (!user) {
      return res.status(401).json({ message: "Not Authorized" });
    }
    req.auth0Id = auth0Id as string;
    req.userId = user._id.toString();
    next();
  } catch (error) {
    return res.status(401).json({ message: "User Not Found" });
  }
};

//1 . take authorozation from req.headers
//2 . check authorixation is valid or not
//3. take a token from authorixation.
//4. decode the token and take authId from it.
// 5. find the user from authId
// 6 add req.auth0id and req.userId and next()

// also install jwt package for both js and ts.
