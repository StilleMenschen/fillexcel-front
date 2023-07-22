import { Link, useNavigate, useParams } from "react-router-dom";
import { Breadcrumb, Button, Form, Input, PaginationProps, Popconfirm, Space, Table, Tooltip, Typography } from "antd";
import { useImmer } from "use-immer";
import { useCallback, useMemo, useState } from "react";
import { ColumnRule, deleteColumnRule, getColumnRuleListByRequirement } from "./column-rule-service.ts";
import { DATA_TYPE } from "../../store/define.ts";
import { DeleteOutlined } from "@ant-design/icons";
import { message } from "../../store/feedback.ts";

const showTotal: PaginationProps["showTotal"] = (total) => `总计 ${total}`;

function ColumnRuleList() {
    const { fillRuleId } = useParams();
    const [queryForm] = Form.useForm();
    const [pageObj, updatePageObj] = useImmer({ number: 1, size: 8, total: 0 });
    const [columnRuleList, setColumnRuleList] = useState<Array<ColumnRule>>([]);
    // 导航到编辑/新增页
    const navigate = useNavigate();

    const handleColumnRuleQuery = useCallback(() => {
        const columnName = queryForm.getFieldValue("columnName") as string;
        getColumnRuleListByRequirement(fillRuleId || "", pageObj.number, pageObj.size, columnName)
            .then(({ data }) => {
                updatePageObj((draft) => {
                    draft.total = data.page.total;
                });
                setColumnRuleList(data.data);
            })
            .catch(() => null);
    }, [fillRuleId, pageObj, queryForm, updatePageObj, setColumnRuleList]);

    useMemo(() => {
        handleColumnRuleQuery();
        return true;
    }, [handleColumnRuleQuery]);

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
                            navigate(`/fillRule/${fillRuleId || ""}/add`);
                        }}>
                        新增
                    </Button>
                </Form.Item>
            </Form>
            <div className="little-space"></div>
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
                <Table.Column<ColumnRule> title="规则ID" dataIndex="rule_id" key="rule_id" />
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
                            <Popconfirm
                                title="确定要删除此规则？"
                                description={<Typography.Text type="warning">所有关联的列规则也会被同步删除！</Typography.Text>}
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
        </>
    );
}

export default ColumnRuleList;
