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
    data_set_id: number | null;
}

/**
 * 列规则参数（与生成规则的参数是对应的）
 * @param column_rule_id
 * @param page
 * @param size
 */
export function getDataParameterListByRule(
    column_rule_id: number | string,
    page: number,
    size: number
): Promise<ResultResponse<Array<DataParameter>>> {
    return httpService.get("/fills/dataParameter", { params: { column_rule_id, page, size } });
}

export function addDataParameter(
    dataParameterList: Array<AddOrUpdateDataParameter>
): Promise<AxiosResponse<Array<DataParameter>>> {
    return httpService.post("/fills/dataParameter", dataParameterList);
}

export function getDataParameter(id: number): Promise<AxiosResponse<DataParameter>> {
    return httpService.get(`/fills/dataParameter/${id}`);
}
