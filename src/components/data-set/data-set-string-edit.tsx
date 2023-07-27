import { Breadcrumb, Button, Card, Col, Divider, Input, Modal, Row, Table, Typography } from "antd";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    addDataSetValue,
    DataSet,
    DataSetValue,
    getDataSet,
    getDataSetValueList,
    updateDataSetValue
} from "./data-set-service.ts";
import { useImmer } from "use-immer";

const showTotal = (total: number) => `总计 ${total}`;

function DataSetStringEdit() {
    const { dataSetId } = useParams();
    const [pageObj, updatePageObj] = useImmer({ number: 1, size: 16, total: 0 });
    const [dataSetValueList, updateDataSetValueList] = useImmer<Array<DataSetValue>>([]);
    const [dataSet, setDataSet] = useState<DataSet>();
    // 新增
    const [openEdit, setOpenEdit] = useState(false);
    const [sigleItem, setSigleItem] = useState("");

    const handleDataSetValueQuery = () => {
        getDataSetValueList(Number(dataSetId), pageObj.number, pageObj.size)
            .then(({ data }) => {
                updateDataSetValueList(data.data);
            })
            .catch(() => null);
    };

    useEffect(() => {
        handleDataSetValueQuery();
    }, [pageObj.number, pageObj.size]);

    useEffect(() => {
        getDataSet(Number(dataSetId))
            .then(({ data }) => {
                setDataSet(data);
            })
            .catch(() => null);
    }, []);

    const handleAddItem = () => {
        addDataSetValue({
            data_set_id: dataSet?.id || -1,
            data_type: dataSet?.data_type || "string",
            item: sigleItem
        })
            .then(() => {
                setSigleItem("");
                handleDataSetValueQuery();
            })
            .catch(() => null);
    };

    const handleUpdateItem = (id: number, value: DataSetValue) => {
        updateDataSetValue(id, {
            data_set_id: value.data_set_id,
            item: value.item,
            data_type: value.data_type
        })
            .then(() => {
                handleDataSetValueQuery();
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

    return (
        <>
            <Breadcrumb items={[{ title: <Link to="/dataSet">数据集</Link> }, { title: "字符串" }]} />
            <div className="little-space"></div>
            <Row>
                <Col flex="auto">
                    <Table<DataSetValue>
                        rowKey="id"
                        showHeader={false}
                        dataSource={dataSetValueList}
                        pagination={{
                            current: pageObj.number,
                            pageSize: pageObj.size,
                            pageSizeOptions: [16, 32],
                            showSizeChanger: true,
                            total: pageObj.total,
                            showTotal: showTotal,
                            onChange: handlePageChange
                        }}>
                        <Table.Column<DataSetValue>
                            title="值"
                            key="item"
                            render={(_, row, idx) => (
                                <Input
                                    value={row.item}
                                    onChange={(e) => {
                                        updateDataSetValueList((draft) => {
                                            const item = draft[idx];
                                            item.item = e.target.value;
                                        });
                                        console.log("change...");
                                    }}
                                    onBlur={() => handleUpdateItem(row.id, row)}
                                />
                            )}
                        />
                    </Table>
                </Col>
                <Col flex="18.75rem">
                    <Card style={{ width: "94%", marginLeft: "6%", maxWidth: "20rem" }}>
                        <Typography.Paragraph>{dataSet?.description}</Typography.Paragraph>
                        <Divider />
                        <Typography.Paragraph>类型：{dataSet?.data_type}</Typography.Paragraph>
                        <Typography.Paragraph>更新于：{dataSet?.updated_at}</Typography.Paragraph>
                        <Button block type="primary" onClick={() => setOpenEdit(true)}>
                            新增
                        </Button>
                    </Card>
                </Col>
            </Row>
            <Modal
                title="Modal"
                open={openEdit}
                onOk={() => {
                    handleAddItem();
                    setOpenEdit(false);
                }}
                onCancel={() => setOpenEdit(false)}
                okText="确认"
                cancelText="取消">
                <Input value={sigleItem} onChange={(e) => setSigleItem(e.target.value)} />
            </Modal>
        </>
    );
}

export default DataSetStringEdit;
