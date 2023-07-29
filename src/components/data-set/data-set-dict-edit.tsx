import { Link, useParams } from "react-router-dom";
import { useImmer } from "use-immer";
import { DataSet, DataSetValue, getDataSet, getDataSetValueList } from "./data-set-service.ts";
import { useEffect, useState } from "react";
import { Breadcrumb, Card, Col, Divider, List, Row, Typography } from "antd";

const showTotal = (total: number) => `总计 ${total}`;

function DataSetDictEdit() {
    const { dataSetId } = useParams();
    const [pageObj, updatePageObj] = useImmer({ number: 1, size: 8, total: 0 });
    const [dataSetValueList, updateDataSetValueList] = useImmer<Array<DataSetValue>>([]);
    const [dataSet, setDataSet] = useState<DataSet>();

    const handleDataSetValueQuery = () => {
        getDataSetValueList(Number(dataSetId), pageObj.number, pageObj.size)
            .then(({ data }) => {
                updateDataSetValueList(data.data);
                updatePageObj((draft) => {
                    draft.total = data.page.total;
                });
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
                            align: "end"
                        }}
                        renderItem={(row, idx) => (
                            <Typography.Text>
                                [{idx}] = {row.item}
                            </Typography.Text>
                        )}
                    />
                </Col>
                <Col flex="18.75rem">
                    <Card style={{ width: "94%", marginLeft: "6%", maxWidth: "20rem" }}>
                        <Typography.Paragraph>{dataSet?.description}</Typography.Paragraph>
                        <Divider />
                        <Typography.Paragraph>类型：{dataSet?.data_type}</Typography.Paragraph>
                        <Typography.Paragraph>更新于：{dataSet?.updated_at}</Typography.Paragraph>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default DataSetDictEdit;
