import { useCallback, useMemo, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { Button, Form, Input, PaginationProps, Popconfirm, Space, Table, Typography, Tooltip } from "antd";
import { DeleteOutlined, EditOutlined, SettingOutlined } from "@ant-design/icons";
import { useUser } from "../../store/account.ts";
import { deleteRequirement, getRequirement, getRequirementList, Requirement } from "./fill-rule-service.ts";
import FillRuleEdit from "./fill-rule-edit.tsx";
import { message } from "../../store/feedback.ts";
import { useNavigate } from "react-router-dom";

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
    const [requirementList, setRequirementList] = useState<Array<Requirement>>([]);
    const editData = useRef<Requirement | null>(null);
    // 导航到配置页
    const navigate = useNavigate();

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
        return true;
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
                <Table.Column<Requirement> title="备注" dataIndex="remark" key="remark" ellipsis={true} />
                <Table.Column<Requirement> title="文件名" dataIndex="original_filename" width={360} key="original_filename" />
                <Table.Column<Requirement> title="起始行" dataIndex="start_line" width={80} key="start_line" />
                <Table.Column<Requirement> title="填充行数" dataIndex="line_number" width={100} key="line_number" />
                <Table.Column<Requirement> title="更新于" dataIndex="updated_at" width={172} key="updated_at" />
                <Table.Column<Requirement>
                    title="操作"
                    key="operation"
                    fixed="right"
                    width={140}
                    render={(_, row) => (
                        <Space size="small">
                            <Tooltip title="配置">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<SettingOutlined style={{ fontSize: "1.12rem" }} />}
                                    onClick={() => navigate(`/fillRule/${row.id}`)}
                                />
                            </Tooltip>
                            <Tooltip title="编辑">
                                <Button
                                    shape="circle"
                                    onClick={() => handleEdit(row.id)}
                                    icon={<EditOutlined style={{ fontSize: "1.12rem" }} />}
                                />
                            </Tooltip>
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
                                <Tooltip title="删除">
                                    <Button shape="circle" icon={<DeleteOutlined style={{ fontSize: "1.12rem" }} />} />
                                </Tooltip>
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