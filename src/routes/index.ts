import { response_not_found, response_success } from "$utils/response.utils";
import { Context, Hono } from "hono";
import * as AuthController from "$controllers/rest/AuthController";
import * as AuthValidation from "$validations/AuthValidations";
import RoutesRegistry from "./registry";
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as ExampleBufferController from "$controllers/rest/ExampleBufferController";

const router = new Hono();

router.post("/login", AuthValidation.validateLoginDTO, AuthController.login);
router.post(
  "/register",
  AuthValidation.validateRegisterDTO,
  AuthController.register
);
router.post("/verify-token", AuthController.verifyToken);
router.put(
  "/update-password",
  AuthMiddleware.checkJwt,
  AuthController.changePassword
);

router.get("/example/buffer/pdf", ExampleBufferController.getPDF);
router.route("/users", RoutesRegistry.UserRoutes);
router.route("/projects", RoutesRegistry.ProjectRoutes);
router.route("/upload", RoutesRegistry.UploadRoutes);
router.route("/technologies", RoutesRegistry.TechnologyRoutes);

router.get("/", (c: Context) => {
  return response_success(c, "Akuuu sayang banget sama ipa!!!");
});

router.get("/robots.txt", (c: Context) => {
  return c.text(`User-agent: *\nAllow: /`);
});

router.get("/ping", (c: Context) => {
  return response_success(c, "pong!");
});

router.all("*", (c: Context) => {
  return response_not_found(c);
});

export default router;
