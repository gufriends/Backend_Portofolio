import { Context, Next } from "hono";
import { response_bad_request } from "$utils/response.utils";
import { ErrorStructure, generateErrorStructure } from "./helper";
import { TechnologyDTO } from "$entities/Technology";
import { prisma } from "$utils/prisma.utils";

export async function validateTechnologyDTO(c: Context, next: Next) {
  const data: TechnologyDTO = await c.req.json();
  const invalidFields: ErrorStructure[] = [];

  if (!data.icon)
    invalidFields.push(generateErrorStructure("icon", "icon cannot be empty"));
  if (!data.alt)
    invalidFields.push(generateErrorStructure("alt", "alt cannot be empty"));
  if (!data.name)
    invalidFields.push(generateErrorStructure("name", "name cannot be empty"));

  const existsName = await prisma.technology.findFirst({
    where: {
      name: data.name,
    },
  });
  if (data.name) {
    if (existsName)
      invalidFields.push(
        generateErrorStructure("name", "technology name already exists")
      );
  }

  if (invalidFields.length !== 0)
    return response_bad_request(c, "Validation Error", invalidFields);
  await next();
}
