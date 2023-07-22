import { Breadcrumb, Button, Col, Form, Input, Row, Select, Switch } from "antd";
import { Link, useParams } from "react-router-dom";
import GenerateRuleSelect from "../generate-rule/generate-rule-select.tsx";
import GenerateRuleParameterForm from "../generate-rule/generate-rule-parameter-form.tsx";
import { useState } from "react";
import { message } from "../../store/feedback.ts";
import { GenerateRule } from "../generate-rule/generate-rule-service.ts";
import { ColumnRule } from "./column-rule-service.ts";

const temp: GenerateRule = {
    id: 0,
    rule_name: "string",
    function_name: "string",
    fill_order: 0,
    description: "string",
    created_at: "string",
    updated_at: "string"
};

function ColumnRuleAdd() {
    const { fillRuleId } = useParams();
    const [editForm] = Form.useForm();
    const [parameterForm] = Form.useForm();
    const [rule, setRule] = useState<GenerateRule>(temp);

    const handleAddColumnRule = (columnRule: ColumnRule) => {
        console.log(columnRule);
        parameterForm
            .validateFields()
            .then((value) => {
                console.log(value);
                message.success("校验通过");
            })
            .catch(() => {
                message.error("校验失败");
            });
    };

    const handleGenerateRuleSelect = (value: GenerateRule) => {
        setRule(value);
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
            <div className="little-space"></div>
            <Row justify="start">
                <Col span={12}>
                    <Form
                        name="queryRuleForm"
                        form={editForm}
                        onFinish={handleAddColumnRule}
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
                            <GenerateRuleSelect onChange={handleGenerateRuleSelect} />
                        </Form.Item>
                        <Form.Item label="数据类型" extra="如果生成规则生成的数据是数字则选择数值类型" name="column_type">
                            <Select
                                options={[
                                    { value: "string", label: "字符串" },
                                    { value: "number", label: "数值" }
                                ]}
                            />
                        </Form.Item>
                        <Form.Item label="数据关联" extra="是否需要关联外部数据集（自动设置）" name="associated_of">
                            <Switch disabled />
                        </Form.Item>
                        <Form.Item style={{ paddingLeft: "4rem" }}>
                            <Button type="primary" htmlType="submit">
                                保存
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={11} offset={1}>
                    <GenerateRuleParameterForm parameterForm={parameterForm} rule={rule} />
                </Col>
            </Row>
        </>
    );
}

export default ColumnRuleAdd;
