import { httpService, ResultResponse } from "../../http";

export interface GenerateRule {
    id: number;
    rule_name: string;
    function_name: string;
    fill_order: number;
    description: string;
    created_at: string;
    updated_at: string;
}

export function getGenerateRuleList(page: number, size: number): Promise<ResultResponse<Array<GenerateRule>>> {
    return httpService.get("/fills/generateRule", { params: { page, size } });
}

export function getGenerateRule(id: number): Promise<ResultResponse<Array<GenerateRule>>> {
    return httpService.get(`/fills/generateRule/${id}`);
}
