import { httpService, ResultResponse } from "../../http";
import { AxiosResponse } from "axios";

export interface DataParameter {
    id: number;
    column_rule_id: number;
    param_rule_id: number;
    name: string;
    value: string;
    data_set_id: number;
    created_at: string;
    updated_at: string;
}

export interface AddOrUpdateDataParameter {
    column_rule_id: number;
    param_rule_id: number;
    name: string;
    value: string;
    data_set_id: number;
}

export function getDataParameterListByRule(
    columnRuleId: number | string,
    page: number,
    size: number,
    columnName?: number | string
): Promise<ResultResponse<Array<DataParameter>>> {
    return httpService.get("/fills/dataParameter", { params: { columnRuleId, page, size, columnName } });
}

export function addDataParameter(
    dataParameterList: Array<AddOrUpdateDataParameter>
): Promise<AxiosResponse<Array<DataParameter>>> {
    return httpService.post("/fills/dataParameter", dataParameterList);
}

export function getDataParameter(id: number): Promise<AxiosResponse<DataParameter>> {
    return httpService.get(`/fills/dataParameter/${id}`);
}

export function updateDataParameter(
    id: number,
    dataParameter: AddOrUpdateDataParameter
): Promise<AxiosResponse<DataParameter>> {
    return httpService.put(`/fills/dataParameter/${id}`, dataParameter);
}

export function deleteDataParameter(id: number): Promise<AxiosResponse<DataParameter>> {
    return httpService.delete(`/fills/dataParameter/${id}`);
}
