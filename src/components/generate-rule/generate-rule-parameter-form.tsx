import { useEffect, useRef, useState } from "react";
import { GenerateRuleParameter, getGenerateRuleParameterListByRule } from "./generate-rule-parameter-service.ts";
import { Button, Form, FormInstance, Input, InputNumber, Space, Switch } from "antd";
import { GenerateRule } from "./generate-rule-service.ts";
import { Rule } from "rc-field-form/lib/interface";
import { DataParameter } from "../column-rule/column-rule-parameter-service.ts";
import DataSetSmallList from "../data-set/data-set-small-list.tsx";

interface GenerateRuleParameterFormProp {
    rule: GenerateRule | null;
    parameterForm: FormInstance;
    saving: boolean;
    defaultParameterList?: Array<DataParameter>;
    onParameterListChange: (parameterList: Array<GenerateRuleParameter>) => void;
}
// 额外的校验规则
const extraRuleMap = new Map<string, Array<Rule>>([
    ["join_string.columns", [{ pattern: /^[A-Z]+(,[A-Z]+)*$/g, message: "必须是大写字母表示的列，以英文逗号分隔" }]],
    ["calculate_expressions.expressions", [{ pattern: /^[0-9A-Z-+*/.{}() ]+$/g, message: "请输入有效的计算表达式" }]],
    ["time_serial_iter.repeat", [{ type: "integer", min: 1, max: 65535, message: "请输入大于1-65535之间的整数" }]],
    ["random_number_iter.ndigits", [{ type: "integer", min: 1, max: 6, message: "请输入大于1-6之间的整数" }]],
    ["random_number_iter.start", [{ type: "number", min: 1, max: 65535, message: "请输入大于1-65535之间的数字" }]],
    ["random_number_iter.stop", [{ type: "number", min: 1, max: 65535, message: "请输入大于1-65535之间的数字" }]]
]);

function GenerateRuleParameterForm(props: GenerateRuleParameterFormProp) {
    const [generateRuleParameterList, setGenerateRuleParameterList] = useState<Array<GenerateRuleParameter>>([]);
    const ruleId = useRef<number>(-1);
    const [openDataSetSelect, setOpenDataSetSelect] = useState(false);
    const [dataSetId, setDataSetId] = useState(-1);

    const settingInitialValues = (data: Array<GenerateRuleParameter>, previousData?: Array<DataParameter>) => {
        const form = props.parameterForm;
        const previousDataMap = new Map();
        if (previousData) {
            previousData.forEach((param) => {
                previousDataMap.set(param.name, param.value);
            });
        }
        data.forEach((grp) => {
            const val = previousDataMap.get(grp.name) || grp.default_value;
            switch (grp.data_type) {
                case "boolean":
                    form.setFieldValue(grp.name, val == "true");
                    break;
                case "number":
                    form.setFieldValue(grp.name, Number(val));
                    if (grp.name == "data_set_id") {
                        setDataSetId(Number(val));
                    }
                    break;
                default:
                    form.setFieldValue(grp.name, val);
            }
        });
    };

    useEffect(() => {
        if (!props.rule || ruleId.current === props.rule.id) return;
        ruleId.current = props.rule.id;
        getGenerateRuleParameterListByRule(props.rule.id, 1, 16)
            .then(({ data }) => {
                setGenerateRuleParameterList(data.data);
                // 设置初始值
                settingInitialValues(data.data, props.defaultParameterList);
                // 设置关联ID
                props.onParameterListChange(data.data);
            })
            .catch(() => null);
    }, [props.rule]);

    const handleCloseDataSetSelect = () => {
        setOpenDataSetSelect(false);
    };

    const handleSelectDataSetId = (dataSetId: number) => {
        props.parameterForm.setFieldValue("data_set_id", Number(dataSetId));
        setDataSetId(dataSetId);
    };

    return (
        <>
            <Form
                form={props.parameterForm}
                disabled={props.saving}
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
                autoComplete="off">
                {generateRuleParameterList.map((parameter) => {
                    if (parameter.need_outside_data) {
                        return (
                            <Form.Item
                                key={parameter.id}
                                label={parameter.description}
                                extra={parameter.hints}
                                name={parameter.name}
                                rules={[
                                    { required: true, message: "请先选择数据集" },
                                    { type: "integer", min: 1, message: "请先选择数据集" }
                                ]}>
                                <Space.Compact>
                                    <Button onClick={() => setOpenDataSetSelect(true)}>选择数据集</Button>
                                    <InputNumber value={dataSetId} disabled style={{ width: "100%" }} />
                                </Space.Compact>
                            </Form.Item>
                        );
                    }
                    // 这里的key和上面的规则名称相关联
                    const ruleKey = `${props.rule?.function_name}.${parameter.name}`;
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
                                    <Switch />
                                </Form.Item>
                            );
                        default:
                            throw Error("生成输入框失败，未知的类型");
                    }
                })}
            </Form>
            {openDataSetSelect && (
                <DataSetSmallList
                    open={openDataSetSelect}
                    onClose={handleCloseDataSetSelect}
                    onSelectDataSetId={handleSelectDataSetId}
                />
            )}
        </>
    );
}

export default GenerateRuleParameterForm;
