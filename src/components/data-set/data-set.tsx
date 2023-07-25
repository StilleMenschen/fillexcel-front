import { useUser } from "../../store/account.ts";
import { useImmer } from "use-immer";
import { DataSet, getDataSetList } from "./data-set-service.ts";
import { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import { DATA_TYPE } from "../../store/define.ts";

const showTotal = (total: number) => `总计 ${total}`;

function DataSet() {
    const { username } = useUser();
    // 分页数据
    const [pageObj, updatePageObj] = useImmer({ number: 1, size: 8, total: 0 });
    const [dataSetList, setDataSetList] = useState<Array<DataSet>>([]);

    const handleDataSetQuery = () => {
        getDataSetList(username, pageObj.number, pageObj.size)
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
        </Table>
    );
}

export default DataSet;
