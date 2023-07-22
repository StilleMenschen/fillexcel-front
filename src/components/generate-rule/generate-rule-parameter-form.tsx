import { useCallback, useMemo, useState } from "react";
import { GenerateRuleParameter, getGenerateRuleParameterListByRule } from "./generate-rule-parameter-service.ts";
import { Button, Form, FormInstance, Input, InputNumber, Switch } from "antd";
import { GenerateRule } from "./generate-rule-service.ts";
import { message } from "../../store/feedback.ts";
import { Rule } from "rc-field-form/lib/interface";

interface GenerateRuleParameterFormProp {
    rule: GenerateRule;
    parameterForm: FormInstance;
}
// 额外的校验规则
export const extraRuleMap = new Map<string, Array<Rule>>([
    ["join_string.columns", [{ pattern: /^[A-Z]+(,[A-Z]+)*$/g, message: "必须是大写字母表示的列，以英文逗号分隔" }]],
    ["calculate_expressions.expressions", [{ pattern: /^[0-9A-Z-+*/.{}() ]+$/g, message: "请输入有效的计算表达式" }]],
    ["time_serial_iter.repeat", [{ type: "integer", min: 1, max: 65535, message: "请输入大于1-65535之间的整数" }]],
    ["random_number_iter.ndigits", [{ type: "integer", min: 1, max: 6, message: "请输入大于1-6之间的整数" }]],
    ["random_number_iter.start", [{ type: "number", min: 1, max: 65535, message: "请输入大于1-65535之间的数字" }]],
    ["random_number_iter.stop", [{ type: "number", min: 1, max: 65535, message: "请输入大于1-65535之间的数字" }]]
]);

export const renderInput = (parameter: GenerateRuleParameter, rule: GenerateRule) => {
    if (parameter.need_outside_data) {
        return (
            <Form.Item key={parameter.id} label={parameter.description} extra={parameter.hints} name={parameter.name}>
                <Button onClick={() => message.info(parameter.rule_id)}>选择数据集</Button>
            </Form.Item>
        );
    }
    // 这里的key和上面的规则名称相关联
    const ruleKey = `${rule.function_name}.${parameter.name}`;
    const extraRule = extraRuleMap.get(ruleKey) || [];
    switch (parameter.data_type) {
        case "string":
            return (
                <Form.Item
                    key={parameter.id}
                    label={parameter.description}
                    extra={parameter.hints}
                    name={parameter.name}
                    rules={[
                        {
                            required: parameter.required,
                            message: "请填写该值"
                        },
                        ...extraRule
                    ]}>
                    <Input placeholder={parameter.hints} />
                </Form.Item>
            );
        case "number":
            return (
                <Form.Item
                    key={parameter.id}
                    label={parameter.description}
                    extra={parameter.hints}
                    name={parameter.name}
                    rules={[
                        {
                            required: parameter.required,
                            message: "请填写该值"
                        },
                        ...extraRule
                    ]}>
                    <InputNumber style={{ width: "100%" }} placeholder={parameter.hints} />
                </Form.Item>
            );
        case "boolean":
            return (
                <Form.Item
                    key={parameter.id}
                    label={parameter.description}
                    extra={parameter.hints}
                    name={parameter.name}
                    valuePropName="checked">
                    <Switch defaultChecked={false} />
                </Form.Item>
            );
        default:
            throw Error("生成输入框失败，未知的类型");
    }
};

export const settingInitialValues = (form: FormInstance, data: Array<GenerateRuleParameter>) => {
    data.forEach((grp) => {
        switch (grp.data_type) {
            case "boolean":
                form.setFieldValue(grp.name, grp.default_value == "true");
                break;
            case "number":
                form.setFieldValue(grp.name, Number(grp.default_value));
                break;
            default:
                form.setFieldValue(grp.name, grp.default_value);
        }
    });
};

function GenerateRuleParameterForm(props: GenerateRuleParameterFormProp) {
    const [generateRuleParameterList, setGenerateRuleParameterList] = useState<Array<GenerateRuleParameter>>([]);

    const queryGenerateRuleParameter = useCallback(() => {
        if (!props.rule.id) return;
        getGenerateRuleParameterListByRule(props.rule.id, 1, 16)
            .then(({ data }) => {
                setGenerateRuleParameterList(data.data);
                settingInitialValues(props.parameterForm, data.data);
            })
            .catch(() => null);
    }, [props, setGenerateRuleParameterList]);

    useMemo(() => {
        queryGenerateRuleParameter();
    }, [queryGenerateRuleParameter]);

    return (
        <Form form={props.parameterForm} labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} autoComplete="off">
            {generateRuleParameterList.map((grp) => renderInput(grp, props.rule))}
        </Form>
    );
}

export default GenerateRuleParameterForm;