import { Hono } from "hono";
import * as ProjectController from "$controllers/rest/ProjectController";
import * as AuthMiddleware from "$middlewares/authMiddleware";
import { validateProjectDTO } from "$validations/ProjectValidation";

const ProjectRoutes = new Hono();

ProjectRoutes.get("/", ProjectController.getAll);

ProjectRoutes.get("/:id", ProjectController.getById);

ProjectRoutes.post(
  "/",
  AuthMiddleware.checkJwt,
  validateProjectDTO,
  ProjectController.create
);

ProjectRoutes.put("/:id", ProjectController.update);

ProjectRoutes.delete("/", ProjectController.deleteByIds);

export default ProjectRoutes;
