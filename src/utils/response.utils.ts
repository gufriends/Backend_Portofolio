import { ServiceResponse } from "$entities/Service";
import { Context } from "hono";
import { TypedResponse } from "hono/types";
import { StatusCode } from "hono/utils/http-status";

export const MIME_TYPE = {
  PDF: "application/pdf",
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
};

const MIME_TYPE_EXTENSION: Record<string, string> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

/**
 * Base of response handler
 * Note: `should not be used in controller`
 * @param c context object from Hono
 * @param status  - status code of a response
 * @param content - the response data
 * @param message - description of a response
 * @param errors  - list of errors if any
 * @returns response
 */
export const response_handler = (
  c: Context,
  status: StatusCode,
  content: unknown = null,
  message = "",
  errors: Array<string> = []
): TypedResponse => {
  c.status(status);
  return c.json({ content, message, errors });
};

/**
 * Bad Request :
 * The server could not understand the request due to invalid syntax
 * @param c context object from Hono
 * @param message description
 * @param errors list of errors
 */
export const response_bad_request = (
  c: Context,
  message = "Bad Request",
  errors: Array<any> = []
): TypedResponse => {
  return response_handler(c, 400, undefined, message, errors);
};

/**
 * Unauthorized :
 * The client must authenticate itself to get the requested response
 * @param c context object from Hono
 * @param message description
 * @param errors list of errors
 */
export const response_unauthorized = (
  c: Context,
  message = "Unauthorized",
  errors: Array<string> = []
): TypedResponse => {
  return response_handler(c, 401, null, message, errors);
};

/**
 * Forbidden :
 * The client does not have access rights to the content
 * @param c context object from Hono
 * @param message description
 * @param errors list of errors
 */
export const response_forbidden = (
  c: Context,
  message = "Forbidden",
  errors: Array<string> = []
): TypedResponse => {
  return response_handler(c, 403, null, message, errors);
};

/**
 * Not Found
 * The server can not find the requested resource
 * @param c context object from Hono
 * @param message description
 * @param errors list of errors
 */
export const response_not_found = (
  c: Context,
  message = "Not Found",
  errors: Array<string> = []
): TypedResponse => {
  return response_handler(c, 404, null, message, errors);
};

/**
 * Conflict
 * This response is sent when a request conflicts with the current state of the server
 * @param c context object from Hono
 * @param message description
 * @param errors list of errors
 */
export const response_conflict = (
  c: Context,
  message = "Conflict",
  errors: Array<string> = []
): TypedResponse => {
  return response_handler(c, 409, null, message, errors);
};

/**
 * Unprocessable Entity
 * The request was well-formed but was unable to be followed due to semantic errors
 * @param c context object from Hono
 * @param message description
 * @param errors list of errors
 */
export const response_unprocessable_entity = (
  c: Context,
  message = "Unprocessable Entity",
  errors: Array<string> = []
): TypedResponse => {
  return response_handler(c, 422, null, message, errors);
};

/**
 * Internal Server Error
 * The server encountered an unexpected condition that prevented it from fulfilling the request
 * @param c context object from Hono
 * @param message description
 * @param errors list of errors
 */
export const response_internal_server_error = (
  c: Context,
  message = "Internal Server Error",
  errors: Array<string> = []
): TypedResponse => {
  return response_handler(c, 500, null, message, errors);
};

/**
 * Ok
 * The request has succeeded
 * @param c context object from Hono
 * @param content response data
 * @param message description
 */
export const response_success = (
  c: Context,
  content: unknown = null,
  message = "Success"
): TypedResponse => {
  return response_handler(c, 200, content, message, []);
};

/**
 * Created
 * The request has succeeded and a new resource has been created as a result
 * @param c context object from Hono
 * @param content response data
 * @param message description
 */
export const response_created = (
  c: Context,
  content: unknown = null,
  message = "Created"
): TypedResponse => {
  return response_handler(c, 201, content, message, []);
};

/**
 * Buffer
 * Send file buffer as response
 * @param c context object from Hono
 * @param fileName name of the file
 * @param mimeType mime type of the file, can be acquired from MIME_TYPE const
 * @param buffer Buffer that will sent to client-side
 */
export const response_buffer = (
  c: Context,
  fileName: string,
  mimeType: string,
  buffer: Buffer
): Response => {
  const extension = MIME_TYPE_EXTENSION[mimeType];
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;

  return c.newResponse(arrayBuffer, 200, {
    "Access-Control-Expose-Headers": "content-disposition",
    "content-disposition": `attachment; filename=${fileName}.${extension}`,
    "Content-Type": mimeType,
  });
};

/**
 * Handle service error and return appropriate response
 * @param c context object from Hono
 * @param serviceResponse service response with error
 */
export const handleServiceErrorWithResponse = (
  c: Context,
  serviceResponse: ServiceResponse<any>
): TypedResponse => {
  const errorCode = serviceResponse.err?.code;
  const errorMessage = serviceResponse.err?.message || "An error occurred";

  switch (errorCode) {
    case 400:
      return response_bad_request(c, errorMessage);
    case 401:
      return response_unauthorized(c, errorMessage);
    case 403:
      return response_forbidden(c, errorMessage);
    case 404:
      return response_not_found(c, errorMessage);
    case 409:
      return response_conflict(c, errorMessage);
    case 422:
      return response_unprocessable_entity(c, errorMessage);
    default:
      return response_internal_server_error(c, errorMessage);
  }
};
