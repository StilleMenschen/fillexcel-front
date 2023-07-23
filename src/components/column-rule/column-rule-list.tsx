import { Link, useNavigate, useParams } from "react-router-dom";
import {
    Breadcrumb,
    Button,
    Card,
    Col,
    Form,
    Input,
    PaginationProps,
    Popconfirm,
    Row,
    Space,
    Table,
    Tooltip,
    Typography
} from "antd";
import { useImmer } from "use-immer";
import { useEffect, useState } from "react";
import { ColumnRule, deleteColumnRule, getColumnRuleListByRequirement } from "./column-rule-service.ts";
import { DATA_TYPE } from "../../store/define.ts";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { message } from "../../store/feedback.ts";
import { getRequirement, Requirement } from "../fill-rule/fill-rule-service.ts";

const showTotal: PaginationProps["showTotal"] = (total) => `总计 ${total}`;

function ColumnRuleList() {
    const { fillRuleId } = useParams();
    const [queryForm] = Form.useForm();
    const [pageObj, updatePageObj] = useImmer({ number: 1, size: 8, total: 0 });
    const [columnRuleList, setColumnRuleList] = useState<Array<ColumnRule>>([]);
    const [fillRuleData, setFillRuleData] = useState<Requirement>();
    // 导航到编辑/新增页
    const navigate = useNavigate();

    const handleColumnRuleQuery = () => {
        const columnName = queryForm.getFieldValue("columnName") as string;
        getColumnRuleListByRequirement(Number(fillRuleId), pageObj.number, pageObj.size, columnName)
            .then(({ data }) => {
                setColumnRuleList(data.data);
                updatePageObj((draft) => {
                    draft.total = data.page.total;
                });
            })
            .catch(() => null);
    };

    useEffect(() => {
        handleColumnRuleQuery();
    }, [pageObj]);

    useEffect(() => {
        getRequirement(Number(fillRuleId))
            .then(({ data }) => {
                setFillRuleData(data);
            })
            .catch(() => null);
    }, []);

    const handlePageChange: PaginationProps["onChange"] = (number, size) => {
        // 如果分页数有变
        if (pageObj.size !== size) {
            updatePageObj((draft) => {
                draft.number = 1;
                draft.size = size;
            });
        } else {
            updatePageObj((draft) => {
                draft.number = number;
            });
        }
    };

    const handleColumnRule = (id: number) => {
        deleteColumnRule(id)
            .then(() => {
                message.success("已删除");
                handleColumnRuleQuery();
            })
            .catch(() => null);
    };

    return (
        <>
            <Breadcrumb items={[{ title: <Link to="/fillRule">填充规则</Link> }, { title: "列规则" }]} />
            <div className="little-space"></div>
            <Form layout="inline" name="queryRuleForm" form={queryForm} onFinish={handleColumnRuleQuery}>
                <Form.Item label="列名" name="columnName">
                    <Input placeholder="请输入列名" allowClear />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">查询</Button>
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        onClick={() => {
                            navigate(`/fillRule/${fillRuleId}/add`);
                        }}>
                        新增
                    </Button>
                </Form.Item>
            </Form>
            <div className="little-space"></div>
            <Row>
                <Col span={18}>
                    <Table<ColumnRule>
                        rowKey="id"
                        dataSource={columnRuleList}
                        pagination={{
                            current: pageObj.number,
                            pageSize: pageObj.size,
                            pageSizeOptions: [8, 16],
                            showSizeChanger: true,
                            total: pageObj.total,
                            showTotal: showTotal,
                            onChange: handlePageChange
                        }}>
                        <Table.Column<ColumnRule> title="列名" dataIndex="column_name" key="column_name" />
                        <Table.Column<ColumnRule>
                            title="数据类型"
                            key="column_type"
                            render={(_, row) => (
                                <Typography.Text> {DATA_TYPE.get(row.column_type) || row.column_type} </Typography.Text>
                            )}
                        />
                        <Table.Column<ColumnRule>
                            title="是否有关联数据"
                            key="associated_of"
                            render={(_, row) => <Typography.Text> {row.associated_of ? "是" : "否"} </Typography.Text>}
                        />
                        <Table.Column<ColumnRule> title="更新于" dataIndex="updated_at" key="updated_at" />
                        <Table.Column<ColumnRule>
                            title="操作"
                            key="operation"
                            fixed="right"
                            width={140}
                            render={(_, row) => (
                                <Space size="small">
                                    <Tooltip title="编辑">
                                        <Button
                                            shape="circle"
                                            onClick={() => navigate(`/fillRule/${fillRuleId}/edit/${row.id}`)}
                                            icon={<EditOutlined style={{ fontSize: "1.12rem" }} />}
                                        />
                                    </Tooltip>
                                    <Popconfirm
                                        title="确定要删除此规则？"
                                        description={
                                            <Typography.Text type="warning">所有关联的列规则也会被同步删除！</Typography.Text>
                                        }
                                        placement="left"
                                        cancelButtonProps={{
                                            danger: true
                                        }}
                                        okType="default"
                                        onCancel={() => handleColumnRule(row.id)}
                                        okText="取消"
                                        cancelText="删除">
                                        <Tooltip title="删除">
                                            <Button shape="circle" icon={<DeleteOutlined style={{ fontSize: "1.12rem" }} />} />
                                        </Tooltip>
                                    </Popconfirm>
                                </Space>
                            )}
                        />
                    </Table>
                </Col>
                <Col span={4}>
                    <Card title={fillRuleData?.remark} style={{ width: "94%", marginLeft: "6%" }}>
                        <Typography.Paragraph>
                            从第 {fillRuleData?.start_line} 行开始填入 {fillRuleData?.line_number} 行数据
                        </Typography.Paragraph>
                        <Typography.Paragraph>文件：{fillRuleData?.original_filename}</Typography.Paragraph>
                        <Typography.Paragraph>更新于：{fillRuleData?.updated_at}</Typography.Paragraph>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default ColumnRuleList;
