import {
  handleServiceErrorWithResponse,
  response_bad_request,
  response_success,
} from "$utils/response.utils";
import { Context, TypedResponse } from "hono";
import * as UploadService from "$services/FileService";

// New method to handle file upload
export async function upload(c: Context): Promise<TypedResponse> {
  const body = await c.req.parseBody();
  const file = body.file as File;

  if (!file) {
    return response_bad_request(c, "File upload is required");
  }

  const serviceResponse = await UploadService.uploadFile(file);

  if (!serviceResponse.status) {
    return handleServiceErrorWithResponse(c, serviceResponse);
  }

  return response_success(
    c,
    serviceResponse.data,
    "File uploaded successfully"
  );
}
