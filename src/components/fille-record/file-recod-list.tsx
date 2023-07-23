import { useEffect, useState } from "react";
import { FileRecord, getFileRecordList } from "./file-recod-service";
import { PaginationProps, Table } from "antd";
import { useImmer } from "use-immer";
import { useUser } from "../../store/account.ts";

const showTotal: PaginationProps["showTotal"] = (total) => `总计 ${total}`;

function FileRecordList() {
    const { username } = useUser();
    // 表格组件分页
    const [pageObj, updatePageObj] = useImmer({ number: 1, size: 8, total: 0 });
    const [fileRecordList, setFileRecordList] = useState<Array<FileRecord>>([]);

    const handleFileRecordQuery = () => {
        getFileRecordList(username, pageObj.number, pageObj.size)
            .then(({ data }) => {
                setFileRecordList(data.data);
                updatePageObj((draft) => {
                    draft.total = data.page.total;
                });
            })
            .catch(() => null);
    };

    useEffect(() => {
        handleFileRecordQuery();
    }, [pageObj]);

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
            <Table<FileRecord>
                rowKey="id"
                dataSource={fileRecordList}
                pagination={{
                    current: pageObj.number,
                    pageSize: pageObj.size,
                    pageSizeOptions: [8, 16],
                    showSizeChanger: true,
                    total: pageObj.total,
                    showTotal: showTotal,
                    onChange: handlePageChange
                }}>
                <Table.Column<FileRecord> title="文件ID" dataIndex="file_id" key="file_id" />
                <Table.Column<FileRecord> title="文件名" dataIndex="filename" key="filename" />
                <Table.Column<FileRecord> title="创建于" dataIndex="created_at" key="created_at" />
            </Table>
        </>
    );
}

export default FileRecordList;
