import {Context, TypedResponse} from "hono"
import * as TechnologyService from "$services/TechnologyService"
import { handleServiceErrorWithResponse, response_created, response_success } from "$utils/response.utils"
import { TechnologyDTO } from "$entities/Technology"
import { FilteringQueryV2 } from "$entities/Query"
import { checkFilteringQueryV2 } from "$controllers/helpers/CheckFilteringQuery"

export async function create(c:Context): Promise<TypedResponse> {
    const data: TechnologyDTO = await c.req.json();

    const serviceResponse = await TechnologyService.create(data);

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_created(c, serviceResponse.data, "Successfully created new Technology!");
}

export async function getAll(c:Context): Promise<TypedResponse> {
    const filters: FilteringQueryV2 = checkFilteringQueryV2(c)

    const serviceResponse = await TechnologyService.getAll(filters)

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_success(c, serviceResponse.data, "Successfully fetched all Technology!")
}

export async function getById(c:Context): Promise<TypedResponse> {
    const id = c.req.param('id')

    const serviceResponse = await TechnologyService.getById(id)

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_success(c, serviceResponse.data, "Successfully fetched Technology by id!")
}

export async function update(c:Context): Promise<TypedResponse> {
    const data: TechnologyDTO = await c.req.json()
    const id = c.req.param('id')

    const serviceResponse = await TechnologyService.update(id, data)

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_success(c, serviceResponse.data, "Successfully updated Technology!")
}

export async function deleteByIds(c:Context): Promise<TypedResponse> {
    const ids = c.req.query('ids') as string

    const serviceResponse = await TechnologyService.deleteByIds(ids)

    if (!serviceResponse.status) {
        return handleServiceErrorWithResponse(c, serviceResponse)
    }

    return response_success(c, serviceResponse.data, "Successfully deleted Technology!")
}
    