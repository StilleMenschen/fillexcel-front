import { httpService, ResultResponse } from "../../http";

export interface GenerateRuleParameter {
    id: string;
    rule_id: string;
    name: string;
    data_type: string;
    description: string;
    required: boolean;
    default_value: string;
    need_outside_data: boolean;
    created_at: string;
    updated_at: string;
}

export function getGenerateRuleParameterListByRule(
    ruleId: number,
    page: number,
    size: number
): Promise<ResultResponse<Array<GenerateRuleParameter>>> {
    return httpService.get("/fills/generateRuleParameter", { params: { ruleId, page, size } });
}

export function getGenerateRuleParameterById(id: number): Promise<ResultResponse<Array<GenerateRuleParameter>>> {
    return httpService.get(`/fills/generateRuleParameter/${id}`);
}
