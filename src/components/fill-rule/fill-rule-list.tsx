import { useCallback, useMemo, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { Breadcrumb, Button, Form, Input, PaginationProps, Popconfirm, Space, Table, Typography } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useUser } from "../../store/account.ts";
import { deleteRequirement, getRequirement, getRequirementList, Requirement } from "./fill-rule-service.ts";
import FillRuleEdit from "./fill-rule-edit.tsx";
import { message } from "../../store/feedback.ts";

interface QueryRequirement {
    remark: string | null;
    original_filename: string | null;
}

const showTotal: PaginationProps["showTotal"] = (total) => `总计 ${total}`;

function FillRuleList() {
    // 查询
    const { username } = useUser();
    const [queryForm] = Form.useForm();
    // 新增/编辑
    const [openEdit, setOpenEdit] = useState(false);
    // 表格组件分页
    const [pageObj, updatePageObj] = useImmer({ number: 1, size: 8, total: 0 });
    const [requirementList, setRequirementList] = useState([] as Array<Requirement>);
    const editData = useRef<Requirement | null>(null);

    const handleFillRuleQuery = useCallback(
        (query: QueryRequirement) => {
            getRequirementList({ username, ...query }, pageObj.number, pageObj.size)
                .then(({ data }) => {
                    setRequirementList(data.data);
                    updatePageObj((draft) => {
                        draft.total = data.page.total;
                    });
                })
                .catch(() => null);
        },
        [username, pageObj, updatePageObj]
    );

    const getQueryFormData = useCallback(
        () => ({
            remark: queryForm.getFieldValue("remark") as string,
            original_filename: queryForm.getFieldValue("original_filename") as string
        }),
        [queryForm]
    );

    useMemo(() => {
        handleFillRuleQuery(getQueryFormData());
        return false;
    }, [handleFillRuleQuery, getQueryFormData]);

    const handleEdit = (id: number) => {
        getRequirement(id)
            .then(({ data }) => {
                editData.current = data;
                setOpenEdit(true);
            })
            .catch(() => null);
    };

    const handleDeleteRequirement = (id: number) => {
        deleteRequirement(id)
            .then(() => {
                message.warning(`数据已删除`);
                handleFillRuleQuery(getQueryFormData());
            })
            .catch(() => null);
    };

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

    return (
        <>
            <Breadcrumb items={[{ title: "填充规则啦" }, { title: "列规则啦" }, { title: "编辑" }]} />
            <div className="little-space"></div>
            <Form layout="inline" form={queryForm} onFinish={handleFillRuleQuery}>
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
                    <Button
                        type="primary"
                        onClick={() => {
                            editData.current = null;
                            setOpenEdit(true);
                        }}>
                        新增
                    </Button>
                </Form.Item>
            </Form>
            <div className="little-space"></div>
            <Table<Requirement>
                rowKey="id"
                dataSource={requirementList}
                pagination={{
                    current: pageObj.number,
                    pageSize: pageObj.size,
                    pageSizeOptions: [8, 16],
                    showSizeChanger: true,
                    total: pageObj.total,
                    showTotal: showTotal,
                    onChange: handlePageChange
                }}>
                <Table.Column<Requirement> title="备注" dataIndex="remark" key="remark" width={256} ellipsis={true} />
                <Table.Column<Requirement> title="文件名" dataIndex="original_filename" key="original_filename" />
                <Table.Column<Requirement> title="起始行" dataIndex="start_line" key="start_line" />
                <Table.Column<Requirement> title="填充行数" dataIndex="line_number" key="line_number" />
                <Table.Column<Requirement> title="更新于" dataIndex="updated_at" key="updated_at" />
                <Table.Column<Requirement>
                    title="操作"
                    key="operation"
                    fixed="right"
                    width={72}
                    render={(_, row) => (
                        <Space size="small">
                            <EditOutlined
                                onClick={() => handleEdit(row.id)}
                                style={{ fontSize: "1.12rem", color: "cyan", cursor: "pointer" }}
                            />
                            <Popconfirm
                                title="确定要删除此规则？"
                                description={<Typography.Text type="warning">所有关联的列规则也会被同步删除！</Typography.Text>}
                                placement="left"
                                cancelButtonProps={{
                                    danger: true
                                }}
                                okType="default"
                                onCancel={() => handleDeleteRequirement(row.id)}
                                okText="取消"
                                cancelText="删除">
                                <DeleteOutlined style={{ fontSize: "1.12rem", color: "red" }} />
                            </Popconfirm>
                        </Space>
                    )}
                />
            </Table>
            {openEdit && (
                <FillRuleEdit
                    editData={editData.current}
                    openEdit={openEdit}
                    setOpenEdit={setOpenEdit}
                    onFillRuleQuery={() => {
                        handleFillRuleQuery(getQueryFormData());
                    }}
                />
            )}
        </>
    );
}

export default FillRuleList;
