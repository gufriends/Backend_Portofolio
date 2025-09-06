
import {Hono} from "hono"
import * as TechnologyController from "$controllers/rest/TechnologyController"

const TechnologyRoutes = new Hono();


TechnologyRoutes.get("/",
    TechnologyController.getAll
)


TechnologyRoutes.get("/:id",
    TechnologyController.getById
)


TechnologyRoutes.post("/",
    TechnologyController.create
)

TechnologyRoutes.put("/:id",
    TechnologyController.update
)

TechnologyRoutes.delete("/",
    TechnologyController.deleteByIds
)

export default TechnologyRoutes
