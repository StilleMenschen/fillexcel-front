import { useEffect, useState } from "react";
import { downloadFile, FileRecord, getFileRecordList } from "./file-recod-service";
import { Button, Form, Input, Table, Tooltip } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useImmer } from "use-immer";
import { useUser } from "../../store/account.ts";
import { message } from "../../store/feedback.ts";

const showTotal = (total: number) => `总计 ${total}`;

interface DownloadButtonProps {
    fileId: number;
    filename: string;
}

/**
 * 独立的下载控制按钮，防止频繁点击
 */
function DownloadButton(props: DownloadButtonProps) {
    const [disabled, setDisabled] = useState(false);

    const handleDownloadFile = () => {
        message.info("文件下载处理中...");
        setDisabled(true);
        downloadFile(props.fileId)
            .then((response) => {
                // 创建一个url对象，指向响应数据
                const url = window.URL.createObjectURL(response.data);
                // 创建一个a标签，设置href为url对象，download为文件名称
                const a = document.createElement("a");
                a.href = url;
                a.download = props.filename;
                // 触发a标签的点击事件，开始下载文件
                a.click();
                // 释放url对象
                window.URL.revokeObjectURL(url);
                a.href = "#";
            })
            .catch(() => null)
            .finally(() => {
                setTimeout(() => {
                    setDisabled(false);
                }, 2000);
            });
    };

    return (
        <Tooltip title="文件下载">
            <Button
                shape="circle"
                icon={<DownloadOutlined style={{ fontSize: "1.12rem" }} />}
                disabled={disabled}
                onClick={handleDownloadFile}
            />
        </Tooltip>
    );
}

function FileRecordList() {
    const { username } = useUser();
    const [queryForm] = Form.useForm();
    // 表格组件分页
    const [pageObj, updatePageObj] = useImmer({ number: 1, size: 8, total: 0 });
    const [fileRecordList, setFileRecordList] = useState<Array<FileRecord>>([]);

    const handleFileRecordQuery = () => {
        const filename = queryForm.getFieldValue("filename") as string;
        getFileRecordList(username, filename, pageObj.number, pageObj.size)
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
            <Form layout="inline" name="queryRecordForm" form={queryForm} onFinish={handleFileRecordQuery}>
                <Form.Item label="文件名" name="filename">
                    <Input placeholder="请输入文件名" allowClear />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">查询</Button>
                </Form.Item>
            </Form>
            <div className="little-space"></div>
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
                <Table.Column<FileRecord>
                    title="下载"
                    key="operation"
                    fixed="right"
                    width={64}
                    render={(_, row) => <DownloadButton key={row.id} fileId={row.id} filename={row.filename} />}
                />
            </Table>
        </>
    );
}

export default FileRecordList;
