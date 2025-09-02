import { Context, Next } from "hono";
import { ErrorStructure, generateErrorStructure } from "./helper";
import { ALLOWED_FORMATS, MAX_FILE_SIZE } from "$utils/format.utils";
import { response_bad_request } from "$utils/response.utils";

export async function validateFile(c: Context, next: Next) {
  const formData = await c.req.parseBody();
  const file = formData.file as File;
  const invalidFields: ErrorStructure[] = [];

  // Check if file exists
  if (!file) {
    invalidFields.push(generateErrorStructure("file", "is required"));
  }

  // File validation
  if (!ALLOWED_FORMATS.includes(file.type)) {
    invalidFields.push(
      generateErrorStructure(
        "file",
        `invalid format. Allowed: ${ALLOWED_FORMATS.join(", ")}`
      )
    );
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    invalidFields.push(
      generateErrorStructure(
        "file",
        `File size exceeds the maximum limit of 1MB.`
      )
    );
  }

  if (invalidFields.length !== 0) {
    return response_bad_request(c, "Validation Error", invalidFields);
  }

  await next();
}
