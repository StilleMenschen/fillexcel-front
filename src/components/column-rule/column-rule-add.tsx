import { Breadcrumb, Button, Col, Form, Input, Row, Select, Switch, Typography } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import GenerateRuleSelect, { GenerateRuleMap } from "../generate-rule/generate-rule-select.tsx";
import GenerateRuleParameterForm from "../generate-rule/generate-rule-parameter-form.tsx";
import { useRef, useState } from "react";
import { message } from "../../store/feedback.ts";
import { GenerateRule } from "../generate-rule/generate-rule-service.ts";
import { addColumnRule, AddOrUpdateColumnRule } from "./column-rule-service.ts";
import { useImmer } from "use-immer";
import { addDataParameter } from "./column-rule-parameter-service.ts";
import { GenerateRuleParameter } from "../generate-rule/generate-rule-parameter-service.ts";

type ParameterMap = {
    [key: string]: string | number | boolean;
};

const parallelSaveParameter = (ruleId: number, parameterList: Array<GenerateRuleParameter>, values: ParameterMap) => {
    return addDataParameter(
        parameterList.map((param) => ({
            param_rule_id: param.id,
            column_rule_id: ruleId,
            name: param.name,
            value: String(values[param.name]),
            data_set_id: 0
        }))
    );
};

function ColumnRuleAdd() {
    const { fillRuleId } = useParams();
    const [editForm] = Form.useForm();
    const [saving, setSaving] = useState(false);
    const [parameterForm] = Form.useForm();
    const parameterList = useRef<Array<GenerateRuleParameter>>([]);
    const [generateRule, setGenerateRule] = useState<GenerateRule | null>(null);
    const [generateRuleId, setGenerateRuleId] = useState<number | null>(null);
    const ruleMap = useRef<GenerateRuleMap>({});
    const [hintObj, updateHintObj] = useImmer({ show: false, text: "" });

    const navigate = useNavigate();

    const handleGenerateRuleLoad = (data: GenerateRuleMap) => {
        ruleMap.current = data;
    };

    const handleAddColumnRule = (columnRule: AddOrUpdateColumnRule) => {
        if (!generateRuleId) {
            message.error("请先选择生成规则");
            return;
        }
        setSaving(true);
        updateHintObj((draft) => {
            draft.show = true;
            draft.text = "处理参数校验...";
        });
        let parameters = {};
        parameterForm
            .validateFields()
            .then((values: ParameterMap) => {
                updateHintObj((draft) => {
                    draft.text = "处理列规则...";
                });
                parameters = values;
                return addColumnRule({ ...columnRule, requirement_id: Number(fillRuleId), rule_id: generateRuleId });
            })
            .then(({ data }) => {
                updateHintObj((draft) => {
                    draft.text = "处理规则参数...";
                });
                return parallelSaveParameter(data.id, parameterList.current, parameters);
            })
            .then(() => {
                message.success("新增成功");
                navigate(`/fillRule/${fillRuleId}`);
            })
            .catch(() => null)
            .finally(() => {
                setSaving(false);
                updateHintObj((draft) => {
                    draft.show = false;
                });
            });
    };

    const setFormField = (name: string, value: unknown) => {
        editForm.setFieldValue(name, value);
    };

    const handleGenerateRuleSelect = (value: number) => {
        const item = ruleMap.current[value];
        setGenerateRuleId(value);
        setGenerateRule(item);
        switch (item.function_name) {
            case "join_string":
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
    };

    const handleParameterListChange = (paramList: Array<GenerateRuleParameter>) => {
        parameterList.current = paramList;
    };

    return (
        <>
            <Breadcrumb
                items={[
                    { title: <Link to="/fillRule">填充规则</Link> },
                    { title: <Link to={`/fillRule/${fillRuleId}`}>列规则</Link> },
                    { title: "新增" }
                ]}
            />
            <Row className="little-top-space" justify="start">
                <Col span={12}>
                    <Form
                        name="queryRuleForm"
                        form={editForm}
                        onFinish={handleAddColumnRule}
                        disabled={saving}
                        initialValues={{
                            column_type: "string",
                            associated_of: false
                        }}>
                        <Form.Item
                            label="单元格列"
                            name="column_name"
                            rules={[
                                { required: true, message: "请填写单元格列值，如A、F、AC" },
                                { pattern: /^[A-Z]{1,3}$/g, message: "单元格列值范围在 A - ZZZ 之间" }
                            ]}>
                            <Input placeholder="请填写单元格列值，如A、F、AC" allowClear />
                        </Form.Item>
                        <Form.Item label="生成规则" extra="选择生成规则" required>
                            <GenerateRuleSelect
                                value={generateRuleId}
                                onLoad={handleGenerateRuleLoad}
                                onChange={handleGenerateRuleSelect}
                            />
                        </Form.Item>
                        <Form.Item
                            label="数据类型"
                            extra="如果生成规则生成的数据是数字则选择数值类型"
                            name="column_type"
                            required>
                            <Select
                                options={[
                                    { value: "string", label: "字符串" },
                                    { value: "number", label: "数值" }
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            label="数据关联"
                            extra="是否需要关联外部数据集（自动设置）"
                            name="associated_of"
                            valuePropName="checked"
                            required>
                            <Switch disabled />
                        </Form.Item>
                        <Form.Item style={{ paddingLeft: "4.8rem" }}>
                            <Button type="primary" htmlType="submit">
                                保存
                            </Button>
                            {hintObj.show && (
                                <Typography.Text style={{ paddingLeft: "1.2rem" }} type="warning">
                                    {hintObj.text}
                                </Typography.Text>
                            )}
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={11} offset={1}>
                    <GenerateRuleParameterForm
                        rule={generateRule}
                        parameterForm={parameterForm}
                        saving={saving}
                        onParameterListChange={handleParameterListChange}
                    />
                </Col>
            </Row>
        </>
    );
}

export default ColumnRuleAdd;
