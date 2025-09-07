import { Context, Next } from "hono";
import { response_bad_request } from "$utils/response.utils";
import { ErrorStructure, generateErrorStructure } from "./helper";
import { ProjectDTO } from "$entities/Project";

export async function validateProjectDTO(c: Context, next: Next) {
  const data: ProjectDTO = await c.req.json();
  const invalidFields: ErrorStructure[] = [];
  if (!data.projectUrl)
    invalidFields.push(
      generateErrorStructure("projectUrl", "projectUrl cannot be empty")
    );
  if (!data.year)
    invalidFields.push(generateErrorStructure("year", "year cannot be empty"));
  if (!data.status)
    invalidFields.push(
      generateErrorStructure("status", "status cannot be empty")
    );
  if (!data.imagePosition)
    invalidFields.push(
      generateErrorStructure("imagePosition", "imagePosition cannot be empty")
    );

  // Validate translations array
  if (
    !data.translations ||
    !Array.isArray(data.translations) ||
    data.translations.length === 0
  )
    invalidFields.push(
      generateErrorStructure(
        "translations",
        "translations must be a non-empty array"
      )
    );

  if (invalidFields.length !== 0)
    return response_bad_request(c, "Validation Error", invalidFields);
  await next();
}
