import { FilteringQueryV2, PagedList } from "$entities/Query";
import {
  INTERNAL_SERVER_ERROR_SERVICE_RESPONSE,
  INVALID_ID_SERVICE_RESPONSE,
  ServiceResponse,
} from "$entities/Service";
import Logger from "$pkg/logger";
import { prisma } from "$utils/prisma.utils";
import { Technology } from "@prisma/client";
import { TechnologyDTO } from "$entities/Technology";
import { buildFilterQueryLimitOffsetV2 } from "./helpers/FilterQueryV2";

export type CreateResponse = Technology | {};
export async function create(
  data: TechnologyDTO
): Promise<ServiceResponse<CreateResponse>> {
  try {
    const technology = await prisma.technology.create({
      data,
    });

    return {
      status: true,
      data: technology,
    };
  } catch (err) {
    Logger.error(`TechnologyService.create : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type GetAllResponse = PagedList<Technology[]> | {};
export async function getAll(
  filters: FilteringQueryV2
): Promise<ServiceResponse<GetAllResponse>> {
  try {
    const usedFilters = buildFilterQueryLimitOffsetV2(filters);

    const [technology, totalData] = await Promise.all([
      prisma.technology.findMany(usedFilters),
      prisma.technology.count({
        where: usedFilters.where,
      }),
    ]);

    let totalPage = 1;
    if (totalData > usedFilters.take)
      totalPage = Math.ceil(totalData / usedFilters.take);

    return {
      status: true,
      data: {
        entries: technology,
        totalData,
        totalPage,
      },
    };
  } catch (err) {
    Logger.error(`TechnologyService.getAll : ${err} `);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type GetByIdResponse = Technology | {};
export async function getById(
  id: string
): Promise<ServiceResponse<GetByIdResponse>> {
  try {
    let technology = await prisma.technology.findUnique({
      where: {
        id,
      },
    });

    if (!technology) return INVALID_ID_SERVICE_RESPONSE;

    return {
      status: true,
      data: technology,
    };
  } catch (err) {
    Logger.error(`TechnologyService.getById : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export type UpdateResponse = Technology | {};
export async function update(
  id: string,
  data: TechnologyDTO
): Promise<ServiceResponse<UpdateResponse>> {
  try {
    let technology = await prisma.technology.findUnique({
      where: {
        id,
      },
    });

    if (!technology) return INVALID_ID_SERVICE_RESPONSE;

    technology = await prisma.technology.update({
      where: {
        id,
      },
      data,
    });

    return {
      status: true,
      data: technology,
    };
  } catch (err) {
    Logger.error(`TechnologyService.update : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}

export async function deleteByIds(ids: string): Promise<ServiceResponse<{}>> {
  try {
    const idArray: string[] = JSON.parse(ids);

    idArray.forEach(async (id) => {
      await prisma.technology.delete({
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
    Logger.error(`TechnologyService.deleteByIds : ${err}`);
    return INTERNAL_SERVER_ERROR_SERVICE_RESPONSE;
  }
}
