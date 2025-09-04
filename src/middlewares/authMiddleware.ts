import jwt from "jsonwebtoken";
import { response_unauthorized } from "$utils/response.utils";
import { Context, Next } from "hono";

export async function checkJwt(c: Context, next: Next) {
  const token = c.req.header("Authorization")?.split(" ")[1];
  const JWT_SECRET = process.env.JWT_SECRET ?? "";
  if (!token) {
    return response_unauthorized(c, "Token should be provided");
  }

  try {
    const decodedValue = jwt.verify(token, JWT_SECRET);
    c.set("jwtPayload", decodedValue);
  } catch (err) {
    console.log(err);
    return response_unauthorized(c, (err as Error).message);
  }
  await next();
}
