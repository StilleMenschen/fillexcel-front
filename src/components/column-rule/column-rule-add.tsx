import { Breadcrumb, Button, Checkbox, Col, Form, Input, Row, Select } from "antd";
import { Link, useParams } from "react-router-dom";
import { message } from "../../store/feedback.ts";
import GenerateRuleSelect from "../generate-rule/generate-rule-select.tsx";
import GenerateRuleParameterForm from "../generate-rule/generate-rule-parameter-form.tsx";
import { useState } from "react";

function ColumnRuleAdd() {
    const { fillRuleId } = useParams();
    const [editForm] = Form.useForm();
    const [ruleId, setRuleId] = useState<number>(0);

    const handleAddColumnRule = () => {
        message.info("新增列规则");
    };

    const handleGenerateRuleSelect = (value: number) => {
        setRuleId(value);
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
                        <Form.Item label="单元格列" name="column_name">
                            <Input placeholder="请输入列名，如A、F、AC" allowClear />
                        </Form.Item>
                        <Form.Item label="生成规则" name="rule_id">
                            <GenerateRuleSelect onChange={handleGenerateRuleSelect} />
                        </Form.Item>
                        <Form.Item label="数据类型" name="column_type">
                            <Select
                                options={[
                                    { value: "string", label: "字符串" },
                                    { value: "number", label: "数值" }
                                ]}
                            />
                        </Form.Item>
                        <Form.Item label="数据关联" name="associated_of">
                            <Checkbox>关联外部数据？</Checkbox>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                保存
                            </Button>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={11} offset={1}>
                    <GenerateRuleParameterForm ruleId={ruleId} />
                </Col>
            </Row>
        </>
    );
}

export default ColumnRuleAdd;
