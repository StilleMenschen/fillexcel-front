import { useEffect, useState } from "react";
import { Button, Form, Input, Popconfirm, Table, Typography, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useUser } from "../../store/account.ts";
import { deleteRequirement, getRequirementList, Requirement } from "./fill-rule-service.ts";
import FillRuleEdit from "./fill-rule-edit.tsx";
import { message } from "../../store/feedback.ts";
import { PaginationProps } from "antd/es/pagination";

interface QueryRequirement {
    remark: string | null;
    original_filename: string | null;
}

const showTotal: PaginationProps["showTotal"] = (total) => `总计 ${total}`;

function FillRule() {
    // 查询
    const { username } = useUser();
    const [queryForm] = Form.useForm();
    // 新增/编辑
    const [openEdit, setOpenEdit] = useState(false);
    // 表格组件分页
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(8);
    const [totalElement, setTotalElement] = useState(0);
    const [requirementList, setRequirementList] = useState([] as Array<Requirement>);

    useEffect(() => {
        getRequirementList({ username }, pageNumber, pageSize)
            .then(({ data }) => {
                setRequirementList(data.data);
                setTotalElement(data.page.total);
            })
            .catch(() => null);
    }, [username, pageNumber, pageSize]);

    const onQuery = (query: QueryRequirement) => {
        getRequirementList({ username, ...query }, pageNumber, pageSize)
            .then(({ data }) => {
                setRequirementList(data.data);
                setTotalElement(data.page.total);
            })
            .catch(() => null);
    };

    const onDeleteRequirement = (id: number) => {
        deleteRequirement(id)
            .then(() => {
                message.warning(`数据已删除`);
                onQuery({
                    remark: queryForm.getFieldValue("remark") as string,
                    original_filename: queryForm.getFieldValue("original_filename") as string
                });
            })
            .catch(() => null);
    };

    const onPageChange: PaginationProps["onChange"] = (number, size) => {
        // 如果分页数有变
        if (pageSize !== size) {
            setPageSize(size);
            setPageNumber(1);
        } else {
            setPageNumber(number);
        }
    };

    return (
        <>
            <Form layout="inline" form={queryForm} onFinish={onQuery}>
                <Form.Item label="备注" name="remark">
                    <Input placeholder="请输入备注" allowClear />
                </Form.Item>
                <Form.Item label="文件名" name="original_filename">
                    <Input placeholder="请输入文件名" allowClear />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">查询</Button>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={() => setOpenEdit(true)}>
                        新增
                    </Button>
                </Form.Item>
            </Form>
            <div className="little-space"></div>
            <Table<Requirement>
                rowKey="id"
                dataSource={requirementList}
                pagination={{
                    current: pageNumber,
                    pageSize: pageSize,
                    pageSizeOptions: [8, 16],
                    showSizeChanger: true,
                    total: totalElement,
                    showTotal: showTotal,
                    onChange: onPageChange
                }}>
                <Table.Column<Requirement> title="备注" dataIndex="remark" key="remark" />
                <Table.Column<Requirement> title="文件名" dataIndex="original_filename" key="original_filename" />
                <Table.Column<Requirement> title="起始行" dataIndex="start_line" key="start_line" />
                <Table.Column<Requirement> title="填充行数" dataIndex="line_number" key="line_number" />
                <Table.Column<Requirement> title="更新于" dataIndex="updated_at" key="updated_at" />
                <Table.Column<Requirement>
                    title="操作"
                    key="operation"
                    fixed="right"
                    render={(_, row) => (
                        <Space size="small">
                            <EditOutlined
                                onClick={() => message.info(`编辑${row.original_filename}`)}
                                style={{ fontSize: "1rem", color: "cyan", cursor: "pointer" }}
                            />
                            <Popconfirm
                                title="确定要删除此规则？"
                                description={<Typography.Text type="warning">所有关联的列规则也会被同步删除！</Typography.Text>}
                                placement="left"
                                cancelButtonProps={{
                                    danger: true
                                }}
                                okType="default"
                                onCancel={() => onDeleteRequirement(row.id)}
                                okText="取消"
                                cancelText="删除">
                                <DeleteOutlined style={{ fontSize: "1rem", color: "red" }} />
                            </Popconfirm>
                        </Space>
                    )}
                />
            </Table>
            <FillRuleEdit openEdit={openEdit} setOpenEdit={setOpenEdit} handleQuery={onQuery} />
        </>
    );
}

export default FillRule;
