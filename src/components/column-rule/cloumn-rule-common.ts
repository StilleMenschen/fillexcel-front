import { GenerateRuleParameter } from "../generate-rule/generate-rule-parameter-service.ts";
import { addDataParameter } from "./column-rule-parameter-service.ts";
import { FormInstance } from "antd";
import { addDataSetBind } from "../data-set/data-set-bind-service.ts";
import { message } from "../../store/feedback.ts";
import { ColumnRule } from "./column-rule-service.ts";

export type ParameterMap = {
    [key: string]: string | number | boolean;
};

export function parallelSaveParameter(rule: ColumnRule, parameterList: Array<GenerateRuleParameter>, values: ParameterMap) {
    if (values["bind_attr_name"]) {
        addDataSetBind({
            data_set_id: Number(values["data_set_id"]),
            column_rule_id: rule.id,
            column_name: rule.column_name,
            data_name: String(values["bind_attr_name"])
        })
            .then(() => {
                message.success(`绑定列属性保存成功 ${rule.column_name} <-> ${values["bind_attr_name"]}`);
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
                data_set_id: param.name == "data_set_id" ? Number(val) : null
            };
        })
    );
}

export function setTypeAndAssociate(editForm: FormInstance, functionName: string) {
    const setFormField = (name: string, value: unknown) => {
        editForm.setFieldValue(name, value);
    };

    switch (functionName) {
        case "join_string":
        case "value_list_iter":
        case "associated_fill":
            setFormField("column_type", "string");
            setFormField("associated_of", true);
            break;
        case "calculate_expressions":
            setFormField("column_type", "number");
            setFormField("associated_of", true);
            break;
        case "random_number_iter":
            setFormField("column_type", "number");
            setFormField("associated_of", false);
            break;
        default:
            setFormField("column_type", "string");
            setFormField("associated_of", false);
    }
}
