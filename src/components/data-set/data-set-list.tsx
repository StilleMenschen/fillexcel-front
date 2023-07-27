import { useUser } from "../../store/account.ts";
import { useImmer } from "use-immer";
import { DataSet, deleteDataSet, getDataSetList } from "./data-set-service.ts";
import { useEffect, useRef, useState } from "react";
import { Button, Form, Input, Space, Table, Tooltip, Typography, Popconfirm } from "antd";
import { DeleteFilled, EditFilled, SettingFilled } from "@ant-design/icons";
import { DATA_TYPE } from "../../store/define.ts";
import DataSetEdit from "./data-set-edit.tsx";
import { message } from "../../store/feedback.ts";
import { useNavigate } from "react-router-dom";

const showTotal = (total: number) => `总计 ${total}`;

function DataSetList() {
    const { username } = useUser();
    const [queryForm] = Form.useForm();
    // 分页数据
    const [pageObj, updatePageObj] = useImmer({ number: 1, size: 8, total: 0 });
    const [dataSetList, setDataSetList] = useState<Array<DataSet>>([]);
    // 编辑
    const editId = useRef(-1);
    const [openEdit, setOpenEdit] = useState(false);
    // 导航
    const navigate = useNavigate();

    const handleDataSetQuery = () => {
        const description = queryForm.getFieldValue("description") as string;
        getDataSetList(username, description, pageObj.number, pageObj.size)
            .then(({ data }) => {
                setDataSetList(data.data);
                updatePageObj((draft) => {
                    draft.total = data.page.total;
                });
            })
            .catch(() => null);
    };

    useEffect(() => {
        handleDataSetQuery();
    }, [pageObj.number, pageObj.size]);

    const handleDeleteDataSet = (id: number) => {
        deleteDataSet(id)
            .then(() => {
                message.warning("已删除");
                handleDataSetQuery();
            })
            .catch(() => null);
    };

    const handlePageChange = (number: number, size: number) => {
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

    const navigateWhenDataType = (dataType: string, dataSetId: number) => {
        switch (dataType) {
            case "string":
                navigate(`/dataSet/string/${dataSetId}`);
                break;
            case "dict":
                message.info("施工中...");
                break;
        }
    };

    return (
        <>
            <Form layout="inline" form={queryForm} onFinish={handleDataSetQuery}>
                <Form.Item label="描述" name="description">
                    <Input placeholder="请输入描述" allowClear />
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
            <Table<DataSet>
                rowKey="id"
                dataSource={dataSetList}
                pagination={{
                    current: pageObj.number,
                    pageSize: pageObj.size,
                    pageSizeOptions: [8, 16],
                    showSizeChanger: true,
                    total: pageObj.total,
                    showTotal: showTotal,
                    onChange: handlePageChange
                }}>
                <Table.Column<DataSet> title="ID" dataIndex="id" key="id" />
                <Table.Column<DataSet> title="描述" dataIndex="description" key="description" />
                <Table.Column<DataSet>
                    title="子元素类型"
                    key="data_type"
                    render={(_, row) => <Typography.Text> {DATA_TYPE.get(row.data_type) || row.data_type} </Typography.Text>}
                />
                <Table.Column<DataSet> title="更新于" dataIndex="updated_at" width={172} key="updated_at" />
                <Table.Column<DataSet> title="创建于" dataIndex="created_at" width={172} key="created_at" />
                <Table.Column<DataSet>
                    title="编辑"
                    key="operation"
                    fixed="right"
                    width={140}
                    render={(_, row) => (
                        <Space size="small">
                            <Tooltip title="配置">
                                <Button
                                    shape="circle"
                                    icon={<SettingFilled style={{ fontSize: "1.12rem" }} />}
                                    onClick={() => navigateWhenDataType(row.data_type, row.id)}
                                />
                            </Tooltip>
                            <Tooltip title="编辑">
                                <Button
                                    shape="circle"
                                    onClick={() => {
                                        editId.current = row.id;
                                        setOpenEdit(true);
                                    }}
                                    icon={<EditFilled style={{ fontSize: "1.12rem" }} />}
                                />
                            </Tooltip>
                            <Popconfirm
                                title="确定要删除此数据集吗？"
                                description={
                                    <Typography.Paragraph type="danger">
                                        所有关联的数据配置也会被全部同步删除！
                                    </Typography.Paragraph>
                                }
                                placement="left"
                                cancelButtonProps={{
                                    danger: true
                                }}
                                okType="default"
                                onCancel={() => handleDeleteDataSet(row.id)}
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
                <DataSetEdit
                    editId={editId.current}
                    openEdit={openEdit}
                    setOpenEdit={setOpenEdit}
                    onDataSetQuery={handleDataSetQuery}
                />
            )}
        </>
    );
}

export default DataSetList;
