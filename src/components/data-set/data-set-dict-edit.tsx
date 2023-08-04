import { Link, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { DataSet, getDataSet } from "./data-set-service.ts";
import { useEffect, useState } from "react";
import { Breadcrumb, Button, Card, Col, Divider, Input, List, Popconfirm, Row, Space, Tag, Typography } from "antd";
import DataSetDictEditForm from "./data-set-dict-edit-form.tsx";
import { EditFilled, MinusCircleFilled } from "@ant-design/icons";
import { message } from "../../store/feedback.ts";
import { DataSetValue, deleteDataSetValue, getDataSetValueList } from "./data-set-value-service.ts";
import { DataSetDefine, getDataSetDefineList } from "./data-set-define-service.ts";

const showTotal = (total: number) => `总计 ${total}`;

function DataSetDictEdit() {
    const { dataSetId } = useParams();
    const dataSetIdNum = Number(dataSetId);
    // 字典数组-数据集查询
    const [pageObj, updatePageObj] = useImmer({ number: 1, size: 8, total: 0 });
    const [dataSetValueList, updateDataSetValueList] = useImmer<Array<DataSetValue>>([]);
    const [dataSet, setDataSet] = useState<DataSet>();
    const [dataSetDefineList, setDataSetDefineList] = useState<Array<DataSetDefine>>([]);
    // 新增编辑
    const [openEdit, setOpenEdit] = useState(false);
    const [editId, setEditId] = useState(-1);

    const handleDataSetValueQuery = () => {
        getDataSetValueList(dataSetIdNum, pageObj.number, pageObj.size)
            .then(({ data }) => {
                updateDataSetValueList(data.data);
                updatePageObj((draft) => {
                    draft.total = data.page.total;
                });
            })
            .catch(() => null);
    };

    const queryDataSetDefineList = (dataSetId: number) => {
        getDataSetDefineList(dataSetId, 1, 64)
            .then(({ data }) => {
                setDataSetDefineList(data.data);
            })
            .catch(() => null);
    };

    useEffect(() => {
        handleDataSetValueQuery();
    }, [pageObj.number, pageObj.size]);

    useEffect(() => {
        getDataSet(dataSetIdNum)
            .then(({ data }) => {
                setDataSet(data);
            })
            .catch(() => null);
        queryDataSetDefineList(dataSetIdNum);
    }, []);

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

    const handleDeleteDataSetValue = (id: number) => {
        deleteDataSetValue(id)
            .then(() => {
                message.warning("已删除");
                handleDataSetValueQuery();
            })
            .catch(() => null);
    };

    return (
        <>
            <Breadcrumb items={[{ title: <Link to="/dataSet">数据集</Link> }, { title: "字典" }]} />
            <Row className="little-top-space">
                <Col flex="auto">
                    <List<DataSetValue>
                        rowKey="id"
                        dataSource={dataSetValueList}
                        pagination={{
                            current: pageObj.number,
                            pageSize: pageObj.size,
                            pageSizeOptions: [8, 16],
                            showSizeChanger: true,
                            total: pageObj.total,
                            showTotal: showTotal,
                            onChange: handlePageChange,
                            position: "bottom",
                            align: "center"
                        }}
                        renderItem={(row) => (
                            <Space.Compact block className="little-top-space">
                                <Input style={{ textAlign: "center" }} value={row.item} readOnly={true} />
                                <Button
                                    icon={<EditFilled />}
                                    onClick={() => {
                                        setEditId(row.id);
                                        setOpenEdit(true);
                                    }}
                                />
                                <Popconfirm
                                    title="确定要删除此记录吗？"
                                    placement="left"
                                    cancelButtonProps={{
                                        danger: true
                                    }}
                                    okType="default"
                                    onCancel={() => handleDeleteDataSetValue(row.id)}
                                    okText="取消"
                                    cancelText="删除">
                                    <Button title="删除" icon={<MinusCircleFilled />} />
                                </Popconfirm>
                            </Space.Compact>
                        )}
                    />
                </Col>
                <Col flex="18.75rem">
                    <Card style={{ width: "94%", marginLeft: "6%", maxWidth: "20rem" }}>
                        <Typography.Paragraph>{dataSet?.description}</Typography.Paragraph>
                        <Divider />
                        <Typography.Paragraph>类型：{dataSet?.data_type}</Typography.Paragraph>
                        <Typography.Paragraph>更新于：{dataSet?.updated_at}</Typography.Paragraph>
                        <Divider />
                        <Typography.Paragraph>字段属性定义</Typography.Paragraph>
                        <Space size={[0, 8]} wrap>
                            {dataSetDefineList.map((define) => (
                                <Tag>{define.name}</Tag>
                            ))}
                        </Space>
                        <Divider />
                        <Button
                            block
                            type="primary"
                            onClick={() => {
                                setEditId(-1);
                                setOpenEdit(true);
                            }}>
                            新增
                        </Button>
                    </Card>
                </Col>
            </Row>
            {openEdit && (
                <DataSetDictEditForm
                    editId={editId}
                    dataSetDefineList={dataSetDefineList}
                    openEditForm={openEdit}
                    onClose={() => setOpenEdit(false)}
                    onDataSetDictQuery={handleDataSetValueQuery}
                />
            )}
        </>
    );
}

export default DataSetDictEdit;
