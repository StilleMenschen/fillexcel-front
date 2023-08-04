import { httpService, ResultResponse } from "../../http";

export interface GenerateRuleParameter {
    id: number;
    rule_id: number;
    name: string;
    data_type: string;
    description: string;
    hints: string;
    required: boolean;
    default_value: string;
    need_outside_data: boolean;
    created_at: string;
    updated_at: string;
}

/**
 * 生成规则参数
 * @param rule_id 生成规则ID
 * @param page
 * @param size
 */
export function getGenerateRuleParameterListByRule(
    rule_id: number,
    page: number,
    size: number
): Promise<ResultResponse<Array<GenerateRuleParameter>>> {
    return httpService.get("/fills/generateRuleParameter", { params: { rule_id, page, size } });
}

/**
 * 单个生成规则参数查询
 */
export function getGenerateRuleParameterById(id: number): Promise<ResultResponse<Array<GenerateRuleParameter>>> {
    return httpService.get(`/fills/generateRuleParameter/${id}`);
}
