import { Hono } from "hono";
import * as ProjectController from "$controllers/rest/ProjectController";
import * as AuthMiddleware from "$middlewares/authMiddleware";

const ProjectRoutes = new Hono();

ProjectRoutes.get("/", ProjectController.getAll);

ProjectRoutes.get("/:id", ProjectController.getById);

ProjectRoutes.post("/", AuthMiddleware.checkJwt, ProjectController.create);

ProjectRoutes.put("/:id", ProjectController.update);

ProjectRoutes.delete("/", ProjectController.deleteByIds);

export default ProjectRoutes;
