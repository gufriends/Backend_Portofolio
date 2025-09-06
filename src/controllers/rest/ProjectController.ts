import { Context, TypedResponse } from "hono";
import * as ProjectService from "$services/ProjectService";
import {
  handleServiceErrorWithResponse,
  response_created,
  response_success,
} from "$utils/response.utils";
import { ProjectDTO } from "$entities/Project";
import { FilteringQueryV2 } from "$entities/Query";
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery";
import { UserDTO } from "$entities/User";

export async function create(c: Context): Promise<TypedResponse> {
  const data: ProjectDTO = await c.req.json();
  const user = c.get("jwtPayload") as UserDTO;

  console.log(user);

  const serviceResponse = await ProjectService.create(data, user);

  if (!serviceResponse.status) {
    return handleServiceErrorWithResponse(c, serviceResponse);
  }

  return response_created(
    c,
    serviceResponse.data,
    "Successfully created new Project!"
  );
}

export async function getAll(c: Context): Promise<TypedResponse> {
  const filters: FilteringQueryV2 = checkFilteringQueryV2(c);

  const serviceResponse = await ProjectService.getAll(filters);

  if (!serviceResponse.status) {
    return handleServiceErrorWithResponse(c, serviceResponse);
  }

  return response_success(
    c,
    serviceResponse.data,
    "Successfully fetched all Project!"
  );
}

export async function getById(c: Context): Promise<TypedResponse> {
  const id = c.req.param("id");

  const serviceResponse = await ProjectService.getById(id);

  if (!serviceResponse.status) {
    return handleServiceErrorWithResponse(c, serviceResponse);
  }

  return response_success(
    c,
    serviceResponse.data,
    "Successfully fetched Project by id!"
  );
}

export async function update(c: Context): Promise<TypedResponse> {
  const data: ProjectDTO = await c.req.json();
  const id = c.req.param("id");

  const serviceResponse = await ProjectService.update(id, data);

  if (!serviceResponse.status) {
    return handleServiceErrorWithResponse(c, serviceResponse);
  }

  return response_success(
    c,
    serviceResponse.data,
    "Successfully updated Project!"
  );
}

export async function deleteByIds(c: Context): Promise<TypedResponse> {
  const ids = c.req.query("ids") as string;

  const serviceResponse = await ProjectService.deleteByIds(ids);

  if (!serviceResponse.status) {
    return handleServiceErrorWithResponse(c, serviceResponse);
  }

  return response_success(
    c,
    serviceResponse.data,
    "Successfully deleted Project!"
  );
}
