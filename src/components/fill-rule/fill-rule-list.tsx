import { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import { Button, Form, Input, PaginationProps, Popconfirm, Space, Table, Tooltip, Typography } from "antd";
import { DeleteFilled, EditFilled, SettingFilled, SnippetsFilled } from "@ant-design/icons";
import { useUser } from "../../store/account.ts";
import { deleteRequirement, generateFile, getRequirementList, Requirement } from "./fill-rule-service.ts";
import FillRuleEdit from "./fill-rule-edit.tsx";
import { message } from "../../store/feedback.ts";
import { useNavigate } from "react-router-dom";

const showTotal: PaginationProps["showTotal"] = (total) => `总计 ${total}`;

interface GenerateButtonProps {
    requirementId: number;
}

/**
 * 独立的生成文件操作按钮，防止频繁点击
 */
function GenerateButton(props: GenerateButtonProps) {
    const [disabled, setDisabled] = useState(false);

    const handleGenerateFile = () => {
        setDisabled(true);
        generateFile(props.requirementId)
            .then(() => {
                message.info("已提交生成请求，稍后可在“文件记录”中下载生成后的文件");
            })
            .catch(() => null)
            .finally(() => {
                setDisabled(false);
            });
    };

    return (
        <Tooltip title="生成文件">
            <Button
                shape="circle"
                icon={<SnippetsFilled style={{ fontSize: "1.12rem" }} />}
                disabled={disabled}
                onClick={handleGenerateFile}
            />
        </Tooltip>
    );
}

function FillRuleList() {
    // 查询
    const { username } = useUser();
    const [queryForm] = Form.useForm();
    // 新增/编辑
    const [openEdit, setOpenEdit] = useState(false);
    // 表格组件分页
    const [pageObj, updatePageObj] = useImmer({ number: 1, size: 8, total: 0 });
    const [requirementList, setRequirementList] = useState<Array<Requirement>>([]);
    const editId = useRef<number>(-1);
    // 导航到配置页
    const navigate = useNavigate();

    const handleFillRuleQuery = () => {
        const query = getQueryFormData();
        getRequirementList({ username, ...query }, pageObj.number, pageObj.size)
            .then(({ data }) => {
                setRequirementList(data.data);
                updatePageObj((draft) => {
                    draft.total = data.page.total;
                });
            })
            .catch(() => null);
    };

    const getQueryFormData = () => ({
        remark: queryForm.getFieldValue("remark") as string,
        original_filename: queryForm.getFieldValue("original_filename") as string
    });

    useEffect(() => {
        handleFillRuleQuery();
    }, [pageObj]);

    const handleEdit = (id: number) => {
        editId.current = id;
        setOpenEdit(true);
    };

    const handleDeleteRequirement = (id: number) => {
        deleteRequirement(id)
            .then(() => {
                message.warning("已删除");
                handleFillRuleQuery();
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
                            editId.current = -1;
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
                    title="生成"
                    key="generates"
                    width={64}
                    render={(_, row) => <GenerateButton key={row.id} requirementId={row.id} />}
                />
                <Table.Column<Requirement>
                    title="编辑"
                    key="operation"
                    fixed="right"
                    width={140}
                    render={(_, row) => (
                        <Space size="small">
                            <Tooltip title="配置">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    icon={<SettingFilled style={{ fontSize: "1.12rem" }} />}
                                    onClick={() => navigate(`/fillRule/${row.id}`)}
                                />
                            </Tooltip>
                            <Tooltip title="编辑">
                                <Button
                                    shape="circle"
                                    onClick={() => handleEdit(row.id)}
                                    icon={<EditFilled style={{ fontSize: "1.12rem" }} />}
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
                                    <Button shape="circle" icon={<DeleteFilled style={{ fontSize: "1.12rem" }} />} />
                                </Tooltip>
                            </Popconfirm>
                        </Space>
                    )}
                />
            </Table>
            {openEdit && (
                <FillRuleEdit
                    editId={editId.current}
                    openEdit={openEdit}
                    setOpenEdit={setOpenEdit}
                    onFillRuleQuery={handleFillRuleQuery}
                />
            )}
        </>
    );
}

export default FillRuleList;
