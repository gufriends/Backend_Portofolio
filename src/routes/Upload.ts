import { Hono } from "hono";
import * as uploadController from "$controllers/rest/UploadController";
import * as uploadValidation from "$validations/UploadValidation";

const UploadRoutes = new Hono();

UploadRoutes.post("/", uploadValidation.validateFile, uploadController.upload);

export default UploadRoutes;
