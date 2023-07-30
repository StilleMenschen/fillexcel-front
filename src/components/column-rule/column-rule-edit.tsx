import { Breadcrumb, Button, Col, Form, Input, Row, Select, Steps, Switch } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import GenerateRuleSelect from "../generate-rule/generate-rule-select.tsx";
import GenerateRuleParameterForm from "../generate-rule/generate-rule-parameter-form.tsx";
import { useEffect, useState } from "react";
import { message } from "../../store/feedback.ts";
import { GenerateRule } from "../generate-rule/generate-rule-service.ts";
import { AddOrUpdateColumnRule, getColumnRule, updateColumnRule } from "./column-rule-service.ts";
import { DataParameter, getDataParameterListByRule } from "./column-rule-parameter-service.ts";
import { GenerateRuleParameter, getGenerateRuleParameterListByRule } from "../generate-rule/generate-rule-parameter-service.ts";
import { parallelSaveParameter, ParameterMap, setTypeAndAssociate } from "./cloumn-rule-common.ts";
import { useGenerateRuleMap } from "../../store/generate-rule.ts";

function ColumnRuleEdit() {
    const { fillRuleId, columnRuleId } = useParams();
    const [editForm] = Form.useForm();
    const [parameterForm] = Form.useForm();
    const [saving, setSaving] = useState(false);
    // 规则数据
    const { generateRuleMap } = useGenerateRuleMap();
    const [generateRule, setGenerateRule] = useState<GenerateRule | null>(null);
    const [generateRuleId, setGenerateRuleId] = useState<number>(-1);
    const [generateRuleParameterList, setGenerateRuleParameterList] = useState<Array<GenerateRuleParameter>>([]);
    // 编辑数据
    const [dataParameterList, setDataParameterList] = useState<Array<DataParameter>>([]);
    // 路由
    const navigate = useNavigate();
    // 步骤
    const [stepCount, setStepCount] = useState(0);

    useEffect(() => {
        const crId = Number(columnRuleId);
        let genRuleId = -1;
        getColumnRule(crId)
            .then(({ data }) => {
                editForm.setFieldValue("column_name", data.column_name);
                editForm.setFieldValue("column_type", data.column_type);
                editForm.setFieldValue("associated_of", data.associated_of);
                genRuleId = data.rule_id;
                return getDataParameterListByRule(crId, 1, 16);
            })
            .then(({ data }) => {
                setDataParameterList(data.data);
                return getGenerateRuleParameterListByRule(genRuleId, 1, 16);
            })
            .then(({ data }) => {
                setGenerateRuleParameterList(data.data);
                setGenerateRuleId(genRuleId);
                setGenerateRule(generateRuleMap[genRuleId]);
            })
            .catch(() => null);
    }, []);

    const handleUpdateColumnRule = (columnRule: AddOrUpdateColumnRule) => {
        if (generateRuleId == -1) {
            message.error("请先选择生成规则");
            return;
        }
        setStepCount(0);
        setSaving(true);
        let parameters = {};
        parameterForm
            .validateFields()
            .then((values: ParameterMap) => {
                setStepCount(1);
                parameters = values;
                const crId = Number(columnRuleId);
                return updateColumnRule(crId, { ...columnRule, requirement_id: Number(fillRuleId), rule_id: generateRuleId });
            })
            .then(({ data }) => {
                setStepCount(2);
                return parallelSaveParameter(data, generateRuleParameterList, parameters);
            })
            .then(() => {
                message.success("保存成功");
                setStepCount(3);
                navigate(`/fillRule/${fillRuleId}`);
            })
            .catch(() => null)
            .finally(() => {
                setSaving(false);
            });
    };

    const handleGenerateRuleSelect = (ruleId: number) => {
        const item = generateRuleMap[ruleId];
        setGenerateRuleId(ruleId);
        getGenerateRuleParameterListByRule(ruleId, 1, 16)
            .then(({ data }) => {
                setGenerateRuleParameterList(data.data);
                setGenerateRule(item);
            })
            .catch(() => null);
        setTypeAndAssociate(editForm, item.function_name);
    };

    return (
        <>
            <Breadcrumb
                items={[
                    { title: <Link to="/fillRule">填充规则</Link> },
                    { title: <Link to={`/fillRule/${fillRuleId}`}>列规则</Link> },
                    { title: "编辑" }
                ]}
            />
            <Row className="little-top-space" justify="start" gutter={8}>
                <Col span={12}>
                    <Form
                        name="columnRuleEditForm"
                        form={editForm}
                        onFinish={handleUpdateColumnRule}
                        disabled={saving}
                        initialValues={{
                            column_type: "number",
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
                            <GenerateRuleSelect value={generateRuleId} onChange={handleGenerateRuleSelect} />
                        </Form.Item>
                        <Form.Item
                            label="数据类型"
                            extra="如果生成规则生成的数据是数字则选择数值类型（自动设置）"
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
                            <Button block type="primary" htmlType="submit">
                                保存
                            </Button>
                        </Form.Item>
                    </Form>
                    {saving && (
                        <Steps
                            current={stepCount}
                            items={[
                                { title: "参数校验" },
                                { title: "保存规则" },
                                { title: "保存规则参数" },
                                { title: "保存完成" }
                            ]}
                        />
                    )}
                </Col>
                <Col span={12}>
                    <GenerateRuleParameterForm
                        rule={generateRule}
                        parameterForm={parameterForm}
                        saving={saving}
                        generateRuleParameterList={generateRuleParameterList}
                        dataParameterList={dataParameterList}
                    />
                </Col>
            </Row>
        </>
    );
}

export default ColumnRuleEdit;
