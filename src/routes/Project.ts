
import {Hono} from "hono"
import * as ProjectController from "$controllers/rest/ProjectController"

const ProjectRoutes = new Hono();


ProjectRoutes.get("/",
    ProjectController.getAll
)


ProjectRoutes.get("/:id",
    ProjectController.getById
)


ProjectRoutes.post("/",
    ProjectController.create
)

ProjectRoutes.put("/:id",
    ProjectController.update
)

ProjectRoutes.delete("/",
    ProjectController.deleteByIds
)

export default ProjectRoutes
