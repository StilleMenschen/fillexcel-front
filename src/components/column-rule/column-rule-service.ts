import { httpService, ResultResponse } from "../../http";
import { AxiosResponse } from "axios";

export interface ColumnRule {
    id: number;
    requirement_id: number;
    rule_id: number;
    column_name: string;
    column_type: string;
    associated_of: boolean;
    created_at: string;
    updated_at: string;
}

export interface AddOrUpdateColumnRule {
    requirement_id: number;
    rule_id: number;
    column_name: string;
    column_type: "string" | "number";
    associated_of: boolean;
}

/**
 * 列规则列表
 * @param requirement_id 填充规则ID
 * @param page
 * @param size
 * @param column_name 列名称
 */
export function getColumnRuleListByRequirement(
    requirement_id: number,
    page: number,
    size: number,
    column_name?: string
): Promise<ResultResponse<Array<ColumnRule>>> {
    return httpService.get("/fills/columnRule", { params: { requirement_id, page, size, column_name } });
}

export function addColumnRule(columnRule: AddOrUpdateColumnRule): Promise<AxiosResponse<ColumnRule>> {
    return httpService.post("/fills/columnRule", columnRule);
}

export function getColumnRule(id: number): Promise<AxiosResponse<ColumnRule>> {
    return httpService.get(`/fills/columnRule/${id}`);
}

export function updateColumnRule(id: number, columnRule: AddOrUpdateColumnRule): Promise<AxiosResponse<ColumnRule>> {
    return httpService.put(`/fills/columnRule/${id}`, columnRule);
}

export function deleteColumnRule(id: number): Promise<AxiosResponse<ColumnRule>> {
    return httpService.delete(`/fills/columnRule/${id}`);
}
