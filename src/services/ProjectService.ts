import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
  INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
  INVALID_ID_SERVICE_RESPONSE,
  ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { Project, ProjectTechnology } from "@prisma/client";
import { ProjectDTO } from "$entities/Project";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { UserDTO } from "$entities/User";
import { ProjectTechnologyDTO } from "$entities/ProjectTechnology";

export type CreateResponse = Project | {};
export async function create(
  data: ProjectDTO,
  user: UserDTO
): Promise<ServiceResponse<CreateResponse>> {
  try {
    if (!user || !user.id) return INVALID_ID_SERVICE_RESPONSE;

    const { translations, ...projectData } = data;

    const project = await prisma.project.create({
      data: {
        ...projectData,
        userId: user.id,
        translations: {
          create: translations,
        },
      },
      include: {
        translations: true,
      },
    });

    return {
      status: true,
      data: project,
    };
  } catch (err) {
    Logger.error(`ProjectService.create : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type CreateProjectTechnology = ProjectTechnology | {};
export async function createProjectTechnology(
  projectId: string,
  data: ProjectTechnologyDTO
): Promise<ServiceResponse<CreateResponse>> {
  try {
    const projectTechnology = await prisma.projectTechnology.create({
      data: {
        projectId,
        technologyId: data.technologyId,
      },
    });

    return {
      status: true,
      data: projectTechnology,
    };
  } catch (err) {
    Logger.error(`ProjectService.createProjectTechnology : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type GetProjectTechnologies = PagedList<ProjectTechnology[]> | {};
export async function getProjectTechnologies(
  projectId: string,
  filters: FilteringQueryV2
): Promise<ServiceResponse<GetProjectTechnologies>> {
  try {
    const usedFilters = buildFilterQueryLimitOffsetV2(filters);

    usedFilters.where = {
      projectId,
    };

    usedFilters.include = {
      technology: true,
    };

    const [projectTechnologies, totalData] = await Promise.all([
      prisma.projectTechnology.findMany(usedFilters),
      prisma.projectTechnology.count({
        where: usedFilters.where,
      }),
    ]);

    let totalPage = 1;
    if (totalData > usedFilters.take)
      totalPage = Math.ceil(totalData / usedFilters.take);

    return {
      status: true,
      data: {
        entries: projectTechnologies,
        totalData,
        totalPage,
      },
    };
  } catch (err) {
    Logger.error(`ProjectService.getProjectTechnologies : ${err} `);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type GetAllResponse = PagedList<Project[]> | {};
export async function getAll(
  filters: FilteringQueryV2
): Promise<ServiceResponse<GetAllResponse>> {
  try {
    const usedFilters = buildFilterQueryLimitOffsetV2(filters);

    usedFilters.include = {
      translations: true,
    };

    const [project, totalData] = await Promise.all([
      prisma.project.findMany(usedFilters),
      prisma.project.count({
        where: usedFilters.where,
      }),
    ]);

    let totalPage = 1;
    if (totalData > usedFilters.take)
      totalPage = Math.ceil(totalData / usedFilters.take);

    return {
      status: true,
      data: {
        entries: project,
        totalData,
        totalPage,
      },
    };
  } catch (err) {
    Logger.error(`ProjectService.getAll : ${err} `);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type GetByIdResponse = Project | {};
export async function getById(
  id: string
): Promise<ServiceResponse<GetByIdResponse>> {
  try {
    let project = await prisma.project.findUnique({
      where: {
        id,
      },
    });

    if (!project) return INVALID_ID_SERVICE_RESPONSE;

    return {
      status: true,
      data: project,
    };
  } catch (err) {
    Logger.error(`ProjectService.getById : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type UpdateResponse = Project | {};
export async function update(
  id: string,
  data: ProjectDTO
): Promise<ServiceResponse<UpdateResponse>> {
  try {
    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: {
        translations: true,
        technologies: true,
      },
    });

    if (!existingProject) return INVALID_ID_SERVICE_RESPONSE;

    const { ...projectData } = data;

    // Build update data dynamically
    const updateData: any = {
      ...projectData,
    };

    // if (technologies) {
    //   updateData.technologies = {
    //     deleteMany: {},
    //     create: technologies.map((tech) => ({
    //       technologyId: tech.technologyId,
    //     })),
    //   };
    // }

    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
      include: {
        translations: true,
        technologies: true,
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
      },
    });

    return {
      status: true,
      data: updatedProject,
    };
  } catch (err) {
    Logger.error(`ProjectService.update : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export async function deleteProjectTechnologies(
  id: string,
  ids: string
): Promise<ServiceResponse<{}>> {
  try {
    const idArray: string[] = JSON.parse(ids);

    // Check if all IDs exist in the database
    const existingTechnologies = await prisma.projectTechnology.findMany({
      where: {
        id: {
          in: idArray,
        },
        projectId: id,
      },
      select: {
        id: true,
      },
    });

    const existingIds = existingTechnologies.map((tech) => tech.id);
    const nonExistentIds = idArray.filter((id) => !existingIds.includes(id));
    if (nonExistentIds.length > 0) {
      Logger.error(
        `Project.deleteTecnologyProjectByIds: Invalid IDs found: ${nonExistentIds.join(
          ", "
        )}`
      );
      return INVALID_ID_SERVICE_RESPONSE;
    }

    idArray.forEach(async (id) => {
      await prisma.projectTechnology.delete({
        where: {
          id,
        },
      });
    });

    return {
      status: true,
      data: {},
    };
  } catch (err) {
    Logger.error(`ProjectService.deleteTecnologyProjectByIds : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export async function deleteByIds(ids: string): Promise<ServiceResponse<{}>> {
  try {
    const idArray: string[] = JSON.parse(ids);

    // Check if all IDs exist in the database
    const existingProjects = await prisma.project.findMany({
      where: {
        id: {
          in: idArray,
        },
      },
      select: {
        id: true,
      },
    });

    const existingIds = existingProjects.map((project) => project.id);
    const nonExistentIds = idArray.filter((id) => !existingIds.includes(id));

    if (nonExistentIds.length > 0) {
      Logger.error(
        `Project.deleteByIds: Invalid IDs found: ${nonExistentIds.join(", ")}`
      );
      return INVALID_ID_SERVICE_RESPONSE;
    }

    idArray.forEach(async (id) => {
      await prisma.project.delete({
        where: {
          id,
        },
      });
    });

    return {
      status: true,
      data: {},
    };
  } catch (err) {
    Logger.error(`ProjectService.deleteByIds : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}
