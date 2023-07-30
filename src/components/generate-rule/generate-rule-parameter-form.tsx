import { Fragment, useEffect, useState } from "react";
import { GenerateRuleParameter } from "./generate-rule-parameter-service.ts";
import { Button, Form, FormInstance, Input, InputNumber, Select, Switch, Typography } from "antd";
import { GenerateRule } from "./generate-rule-service.ts";
import { Rule } from "rc-field-form/lib/interface";
import { DataParameter } from "../column-rule/column-rule-parameter-service.ts";
import DataSetSmallList from "../data-set/data-set-small-list.tsx";
import { DataSetDefine, getDataSetDefineList } from "../data-set/data-set-define-service.ts";

interface GenerateRuleParameterFormProp {
    rule: GenerateRule | null;
    parameterForm: FormInstance;
    saving: boolean;
    dataParameterList?: Array<DataParameter>;
    generateRuleParameterList: Array<GenerateRuleParameter>;
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

const specialFunctionNameSet = new Set(["associated_fill", "value_list_iter"]);

function GenerateRuleParameterForm(props: GenerateRuleParameterFormProp) {
    const [openDataSetSelect, setOpenDataSetSelect] = useState(false);
    // 数据集
    const [dataSetDescription, setDataSetDescription] = useState("");
    const [dataSetType, setDataSetType] = useState("string");
    const [dataSetDefineList, setDataSetDefineList] = useState<Array<DataSetDefine>>([]);

    const queryDataSetDefineList = (dataSetId: number) => {
        getDataSetDefineList(dataSetId, 1, 64)
            .then(({ data }) => {
                setDataSetDefineList(data.data);
            })
            .catch(() => null);
    };

    const setParameters = (generateRuleParameters: Array<GenerateRuleParameter>, dataParameters?: Array<DataParameter>) => {
        const form = props.parameterForm;
        if (dataParameters) {
            const previousDataMap = new Map();
            dataParameters.forEach((param) => {
                previousDataMap.set(param.name, param.value);
            });
            generateRuleParameters.forEach((grp) => {
                grp.default_value = previousDataMap.get(grp.name) || grp.default_value;
            });
        }
        generateRuleParameters.map((grp) => {
            const val = grp.default_value;
            if (!val && val == "") return false;
            switch (grp.data_type) {
                case "boolean":
                    form.setFieldValue(grp.name, val == "true");
                    break;
                case "number":
                    form.setFieldValue(grp.name, Number(val));
                    if (grp.name == "data_set_id") {
                        queryDataSetDefineList(Number(val));
                    }
                    break;
                default:
                    form.setFieldValue(grp.name, val);
            }
        });
    };

    useEffect(() => {
        setParameters(props.generateRuleParameterList, props.dataParameterList);
    }, [props.rule]);

    const handleCloseDataSetSelect = () => {
        setOpenDataSetSelect(false);
    };

    const handleSelectDataSetId = (dataSetId: number, description: string) => {
        props.parameterForm.setFieldValue("data_set_id", Number(dataSetId));
        setDataSetDescription(description);
        queryDataSetDefineList(dataSetId);
    };

    const renderSpecialItem = (ruleFunctionName: string, parameter: GenerateRuleParameter) => {
        const itemAttr = {
            key: parameter.id,
            label: parameter.description,
            extra: parameter.hints,
            name: parameter.name
        };
        switch (ruleFunctionName) {
            case "value_list_iter":
                return (
                    <Form.Item
                        {...itemAttr}
                        rules={[
                            { required: true, message: "请先选择数据集" },
                            { type: "integer", min: 1, message: "请先选择数据集" }
                        ]}>
                        <Input.TextArea value={dataSetDescription} readOnly autoSize={{ minRows: 2, maxRows: 6 }} />
                        <Button
                            className="little-top-space"
                            onClick={() => {
                                setDataSetType("string");
                                setOpenDataSetSelect(true);
                            }}>
                            选择数据集
                        </Button>
                        <Typography.Text style={{ paddingLeft: "1rem" }}>
                            ID：{props.parameterForm.getFieldValue("data_set_id")}
                        </Typography.Text>
                    </Form.Item>
                );
            case "associated_fill":
                return (
                    <Fragment key="associated_fill">
                        <Form.Item
                            {...itemAttr}
                            rules={[
                                { required: true, message: "请先选择数据集" },
                                { type: "integer", min: 1, message: "请先选择数据集" }
                            ]}>
                            <Input.TextArea value={dataSetDescription} readOnly autoSize={{ minRows: 2, maxRows: 6 }} />
                            <Button
                                className="little-top-space"
                                onClick={() => {
                                    setDataSetType("dict");
                                    setOpenDataSetSelect(true);
                                }}>
                                选择数据集
                            </Button>
                            <Typography.Text style={{ paddingLeft: "1rem" }}>
                                ID：{props.parameterForm.getFieldValue("data_set_id")}
                            </Typography.Text>
                        </Form.Item>
                        <Form.Item
                            key="bind_attr_name"
                            name="bind_attr_name"
                            label="绑定字段属性"
                            extra="选择绑定到该单元格的字段属性，如果对应字段属性数据是空的则会跳过填写（每行）"
                            required>
                            <Select
                                placeholder="请选择字段属性"
                                options={dataSetDefineList.map((define) => ({
                                    value: define.name,
                                    label: define.name
                                }))}
                            />
                        </Form.Item>
                    </Fragment>
                );
            default:
                throw Error("生成输入框失败，未知的类型");
        }
    };

    const renderNormalItem = (ruleFunctionName: string, parameter: GenerateRuleParameter) => {
        const itemAttr = {
            key: parameter.id,
            label: parameter.description,
            extra: parameter.hints,
            name: parameter.name
        };
        // 根据规则名称补充校验
        const ruleKey = `${ruleFunctionName}.${parameter.name}`;
        const extraRule = extraRuleMap.get(ruleKey) || [];
        const rules = [{ required: parameter.required, message: "请填写该值" }, ...extraRule];
        switch (parameter.data_type) {
            case "string":
                return (
                    <Form.Item {...itemAttr} rules={rules}>
                        <Input placeholder={parameter.hints} />
                    </Form.Item>
                );
            case "number":
                return (
                    <Form.Item {...itemAttr} rules={rules}>
                        <InputNumber style={{ width: "100%" }} placeholder={parameter.hints} />
                    </Form.Item>
                );
            case "boolean":
                return (
                    <Form.Item {...itemAttr} valuePropName="checked">
                        <Switch />
                    </Form.Item>
                );
            default:
                throw Error("生成输入框失败，未知的类型");
        }
    };

    const formItemList = props.generateRuleParameterList.map((parameter) => {
        const ruleFunctionName = String(props.rule?.function_name);
        if (specialFunctionNameSet.has(ruleFunctionName)) {
            return renderSpecialItem(ruleFunctionName, parameter);
        } else {
            return renderNormalItem(ruleFunctionName, parameter);
        }
    });

    return (
        <>
            <Form
                key="generateRuleParameterForm"
                name="generateRuleParameterEditForm"
                form={props.parameterForm}
                disabled={props.saving}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                autoComplete="off">
                {formItemList}
            </Form>
            {openDataSetSelect && (
                <DataSetSmallList
                    open={openDataSetSelect}
                    dataType={dataSetType}
                    onClose={handleCloseDataSetSelect}
                    onSelectDataSetId={handleSelectDataSetId}
                />
            )}
        </>
    );
}

export default GenerateRuleParameterForm;
