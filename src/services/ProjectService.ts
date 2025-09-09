import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
  INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
  INVALID_ID_SERVICE_RESPONSE,
  ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { Project } from "@prisma/client";
import { ProjectDTO } from "$entities/Project";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";
import { UserDTO } from "$entities/User";

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
        technologies: {
          include: {
            technology: true,
          },
        },
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
export type GetAllResponse = PagedList<Project[]> | {};
export async function getAll(
  filters: FilteringQueryV2
): Promise<ServiceResponse<GetAllResponse>> {
  try {
    const usedFilters = buildFilterQueryLimitOffsetV2(filters);

    usedFilters.include = {
      translations: true,
      technologies: {
        include: {
          technology: true,
        },
      },
      user: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
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

export async function deleteByIds(ids: string): Promise<ServiceResponse<{}>> {
  try {
    const idArray: string[] = JSON.parse(ids);

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
