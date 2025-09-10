import { Context, Next } from "hono";
import { response_bad_request } from "$utils/response.utils";
import { ErrorStructure, generateErrorStructure } from "./helper";
import { ProjectDTO } from "$entities/Project";
import { ProjectTechnologyDTO } from "$entities/ProjectTechnology";
import { prisma } from "$utils/prisma.utils";

export async function validateProjectDTO(c: Context, next: Next) {
  const data: ProjectDTO = await c.req.json();
  const invalidFields: ErrorStructure[] = [];
  if (!data.projectUrl)
    invalidFields.push(
      generateErrorStructure("projectUrl", "projectUrl cannot be empty")
    );
  if (!data.year)
    invalidFields.push(generateErrorStructure("year", "year cannot be empty"));
  if (!data.status)
    invalidFields.push(
      generateErrorStructure("status", "status cannot be empty")
    );
  if (!data.imagePosition)
    invalidFields.push(
      generateErrorStructure("imagePosition", "imagePosition cannot be empty")
    );

  // Validate translations array
  if (
    !data.translations ||
    !Array.isArray(data.translations) ||
    data.translations.length === 0
  )
    invalidFields.push(
      generateErrorStructure(
        "translations",
        "translations must be a non-empty array"
      )
    );

  if (invalidFields.length !== 0)
    return response_bad_request(c, "Validation Error", invalidFields);
  await next();
}

export async function validateProjectTechnologyDTO(c: Context, next: Next) {
  const data: ProjectTechnologyDTO = await c.req.json();
  const id = c.req.param("id");
  const invalidFields: ErrorStructure[] = [];
  if (!data.technologyId)
    invalidFields.push(
      generateErrorStructure("technologyId", " cannot be empty")
    );

  const existsProject = await prisma.project.findUnique({
    where: {
      id: id,
    },
  });
  const existsTechnology = await prisma.technology.findUnique({
    where: {
      id: data.technologyId,
    },
  });

  if (data.technologyId) {
    if (!existsTechnology)
      invalidFields.push(
        generateErrorStructure("technologyId", "technology does not exist")
      );
    if (existsTechnology) {
      const existingProjectTechnology =
        await prisma.projectTechnology.findFirst({
          where: {
            projectId: id,
            technologyId: data.technologyId,
          },
        });
      if (existingProjectTechnology)
        invalidFields.push(
          generateErrorStructure(
            "technologyId",
            "technology already added to this project"
          )
        );
    }
  }
  if (id) {
    if (!existsProject)
      invalidFields.push(
        generateErrorStructure("projectId", "project does not exist")
      );
  }

  if (invalidFields.length !== 0)
    return response_bad_request(c, "Validation Error", invalidFields);
  await next();
}
