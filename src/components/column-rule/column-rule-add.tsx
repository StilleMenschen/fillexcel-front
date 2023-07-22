import { Breadcrumb, Button, Col, Form, Input, Row, Select, Switch, Typography } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import GenerateRuleSelect from "../generate-rule/generate-rule-select.tsx";
import GenerateRuleParameterForm from "../generate-rule/generate-rule-parameter-form.tsx";
import { useRef, useState } from "react";
import { message } from "../../store/feedback.ts";
import { GenerateRule } from "../generate-rule/generate-rule-service.ts";
import { addColumnRule, AddOrUpdateColumnRule } from "./column-rule-service.ts";
import { useImmer } from "use-immer";
import { addDataParameter, DataParameter } from "./column-rule-parameter-service.ts";
import { AxiosResponse } from "axios";
import { GenerateRuleParameter } from "../generate-rule/generate-rule-parameter-service.ts";

type ParameterMap = {
    [key: string]: string | number | boolean;
};

const saveColumnRule = (requirement_id: number, rule_id: number, columnRule: AddOrUpdateColumnRule) => {
    return addColumnRule({
        ...columnRule,
        requirement_id,
        rule_id
    });
};

const parallelSaveParameter = (ruleId: number, parameterList: Array<GenerateRuleParameter>, values: ParameterMap) => {
    return Promise.all<AxiosResponse<DataParameter>>(
        parameterList.map((param) => {
            return addDataParameter({
                param_rule_id: param.id,
                column_rule_id: ruleId,
                name: param.name,
                value: String(values[param.name]),
                data_set_id: 0
            });
        })
    );
};

function ColumnRuleAdd() {
    const { fillRuleId } = useParams();
    const [editForm] = Form.useForm();
    const [parameterForm] = Form.useForm();
    const parameterList = useRef<Array<GenerateRuleParameter>>([]);
    const [generateRule, setGenerateRule] = useState<GenerateRule | null>(null);
    const [hintObj, updateHintObj] = useImmer({ show: false, text: "" });

    const navigate = useNavigate();

    const handleAddColumnRule = (columnRule: AddOrUpdateColumnRule) => {
        if (!generateRule?.id) {
            message.error("请先选择生成规则");
            return;
        }
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
                return saveColumnRule(Number(fillRuleId), generateRule.id, columnRule);
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
            .catch(() => {
                message.error("校验失败");
            })
            .finally(() => {
                updateHintObj((draft) => {
                    draft.show = false;
                });
            });
    };

    const handleGenerateRuleSelect = (value: GenerateRule) => {
        setGenerateRule(value);
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
                        parameterForm={parameterForm}
                        rule={generateRule}
                        onParameterListChange={handleParameterListChange}
                    />
                </Col>
            </Row>
        </>
    );
}

export default ColumnRuleAdd;
