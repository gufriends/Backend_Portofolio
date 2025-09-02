import { UserLoginDTO, UserRegisterDTO } from "$entities/User";
import { Context, Next } from "hono";
import { response_bad_request } from "../utils/response.utils";
import { generateErrorStructure } from "./helper";
import { prisma } from "$utils/prisma.utils";

function validateEmailFormat(email: string): boolean {
  const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return expression.test(email);
}

export async function validateRegisterDTO(c: Context, next: Next) {
  const data: UserRegisterDTO = await c.req.json();

  const invalidFields = [];

  if (!data.email)
    invalidFields.push(generateErrorStructure("email", "email is required"));
  if (!data.fullName)
    invalidFields.push(
      generateErrorStructure("fullName", "fullname is required")
    );
  if (data.email && !validateEmailFormat(data.email))
    invalidFields.push(
      generateErrorStructure("email", "email format is invalid")
    );
  if (!data.password)
    invalidFields.push(
      generateErrorStructure("password", "password is required")
    );

  const userExist = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (userExist != null) {
    invalidFields.push(generateErrorStructure("email", "email already used"));
  }

  if (invalidFields.length > 0) {
    return response_bad_request(c, "Bad Request", invalidFields);
  }

  await next();
}

export async function validateLoginDTO(c: Context, next: Next) {
  const data: UserLoginDTO = await c.req.json();

  const invalidFields = [];

  if (!data.email)
    invalidFields.push(generateErrorStructure("email", "email is required"));
  if (data.email && !validateEmailFormat(data.email))
    invalidFields.push(
      generateErrorStructure("email", "email format is invalid")
    );
  if (!data.password)
    invalidFields.push(
      generateErrorStructure("password", "password is required")
    );

  const userExist = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!userExist) {
    invalidFields.push(generateErrorStructure("email", "email not found"));
  }

  if (invalidFields.length > 0) {
    return response_bad_request(c, "Bad Request", invalidFields);
  }

  await next();
}
