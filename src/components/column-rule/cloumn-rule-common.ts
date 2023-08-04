import { GenerateRuleParameter } from "../generate-rule/generate-rule-parameter-service.ts";
import { addDataParameter } from "./column-rule-parameter-service.ts";
import { FormInstance } from "antd";
import { addDataSetBind } from "../data-set/data-set-bind-service.ts";
import { message } from "../../store/feedback.ts";
import { ColumnRule } from "./column-rule-service.ts";

export type ParameterMap = {
    [key: string]: string | number | boolean;
};

/**
 * 保存列规则的参数
 * @param rule 列规则
 * @param parameterList 生成参数列表
 * @param values 对应实际配置的参数值
 */
export function parallelSaveParameter(rule: ColumnRule, parameterList: Array<GenerateRuleParameter>, values: ParameterMap) {
    if (values["bind_attr_name"]) {
        // 如果有绑定属性的情况（数据集）
        addDataSetBind({
            data_set_id: Number(values["data_set_id"]),
            column_rule_id: rule.id,
            column_name: rule.column_name,
            data_name: String(values["bind_attr_name"])
        })
            .then(() => {
                message.success(`绑定列属性 ${rule.column_name} <-> ${values["bind_attr_name"]} 保存成功`);
            })
            .catch(() => null);
    }
    return addDataParameter(
        parameterList.map((param) => {
            const val = values[param.name];
            return {
                param_rule_id: param.id,
                column_rule_id: rule.id,
                name: param.name,
                value: String(val),
                // 关联数据集的情况需要保存关联的 ID
                data_set_id: param.name == "data_set_id" ? Number(val) : null
            };
        })
    );
}

/**
 * 不同的生成规则有不同的数据类型以及是否有数据关联
 * @param editForm
 * @param functionName 生成方法名称
 */
export function setTypeAndAssociate(editForm: FormInstance, functionName: string) {
    let columnType = "string";
    let associatedOf = false;
    switch (functionName) {
        case "join_string":
        case "value_list_iter":
        case "associated_fill":
            associatedOf = true;
            break;
        case "calculate_expressions":
            columnType = "number";
            associatedOf = true;
            break;
        case "random_number_iter":
            columnType = "number";
            break;
    }
    editForm.setFieldValue("column_type", columnType);
    editForm.setFieldValue("associated_of", associatedOf);
}
