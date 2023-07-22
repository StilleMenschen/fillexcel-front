import { useCallback, useMemo, useState } from "react";
import { GenerateRuleParameter, getGenerateRuleParameterListByRule } from "./generate-rule-parameter-service.ts";
import { Form, FormInstance, Input, InputNumber, Switch } from "antd";

interface GenerateRuleParameterFormProp {
    ruleId: number;
    parameterForm: FormInstance;
}

const renderInput = (parameter: GenerateRuleParameter) => {
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
                        }
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
                        }
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

const settingInitialValue = (form: FormInstance, data: Array<GenerateRuleParameter>) => {
    data.forEach((grp) => {
        if (grp.default_value) {
            if (grp.data_type == "boolean") {
                form.setFieldValue(grp.name, grp.default_value == "true");
            } else {
                form.setFieldValue(grp.name, grp.default_value);
            }
        }
    });
};

function GenerateRuleParameterForm(props: GenerateRuleParameterFormProp) {
    const [generateRuleParameterList, setGenerateRuleParameterList] = useState<Array<GenerateRuleParameter>>([]);

    const queryGenerateRuleParameter = useCallback(() => {
        if (!props.ruleId) return;
        getGenerateRuleParameterListByRule(props.ruleId, 1, 16)
            .then(({ data }) => {
                setGenerateRuleParameterList(data.data);
                settingInitialValue(props.parameterForm, data.data);
            })
            .catch(() => null);
    }, [props, setGenerateRuleParameterList]);

    useMemo(() => {
        queryGenerateRuleParameter();
    }, [queryGenerateRuleParameter]);

    return (
        <Form form={props.parameterForm} labelCol={{ span: 3 }} wrapperCol={{ span: 21 }} autoComplete="off">
            {generateRuleParameterList.map((grp) => renderInput(grp))}
        </Form>
    );
}

export default GenerateRuleParameterForm;
