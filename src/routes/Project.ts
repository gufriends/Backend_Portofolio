import { Hono } from "hono";
import * as ProjectController from "$controllers/rest/ProjectController";
import * as AuthMiddleware from "$middlewares/authMiddleware";
import * as ProjectValidation from "$validations/ProjectValidation";

const ProjectRoutes = new Hono();

ProjectRoutes.get("/", ProjectController.getAll);

ProjectRoutes.get("/:id", ProjectController.getById);

ProjectRoutes.post(
  "/",
  AuthMiddleware.checkJwt,
  ProjectValidation.validateProjectDTO,
  ProjectController.create
);

ProjectRoutes.post(
  "/:id/technologies",
  AuthMiddleware.checkJwt,
  ProjectValidation.validateProjectTechnologyDTO,
  ProjectController.createProjectTechnology
);

ProjectRoutes.get(
  "/:id/technologies",
  ProjectController.getProjectTechnologies
);

ProjectRoutes.delete(
  "/:id/technologies",
  AuthMiddleware.checkJwt,
  ProjectController.deleteProjectTechnologies
);

ProjectRoutes.put("/:id", ProjectController.update);

ProjectRoutes.delete("/", ProjectController.deleteByIds);

export default ProjectRoutes;
