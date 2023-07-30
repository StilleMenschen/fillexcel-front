import { Button, Card, Drawer, Form, Input, Pagination, Typography } from "antd";
import { useUser } from "../../store/account.ts";
import { useImmer } from "use-immer";
import { useEffect, useState } from "react";
import { DataSet, getDataSetList } from "./data-set-service.ts";

const showTotal = (total: number) => `总计 ${total}`;

interface DataSetSmallListProps {
    open: boolean;
    onClose: () => void;
    dataType: string;
    onSelectDataSetId: (dataSetId: number, description: string) => void;
}

function DataSetSmallList(props: DataSetSmallListProps) {
    const { username } = useUser();
    const [queryForm] = Form.useForm();
    // 分页数据
    const [pageObj, updatePageObj] = useImmer({ number: 1, size: 8, total: 0 });
    const [dataSetList, setDataSetList] = useState<Array<DataSet>>([]);

    const handleDataSetQuery = () => {
        const description = queryForm.getFieldValue("description") as string;
        getDataSetList(username, description, props.dataType, pageObj.number, pageObj.size)
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

    const handleSelectDataSetId = (id: number, description: string) => {
        props.onSelectDataSetId(id, description);
        props.onClose();
    };

    return (
        <Drawer
            title="选择数据集"
            placement="right"
            size="large"
            maskClosable={false}
            open={props.open}
            onClose={props.onClose}>
            <Form name="queryDataSetSmallForm" layout="inline" form={queryForm} onFinish={handleDataSetQuery}>
                <Form.Item label="描述" name="description">
                    <Input placeholder="请输入描述" allowClear />
                </Form.Item>
                <Form.Item>
                    <Button htmlType="submit">查询</Button>
                </Form.Item>
            </Form>
            {dataSetList.map((row) => (
                <Card
                    key={row.id}
                    title={row.id}
                    size="small"
                    extra={
                        <Button type="link" onClick={() => handleSelectDataSetId(row.id, row.description)}>
                            选择
                        </Button>
                    }
                    className="little-top-space">
                    <Typography.Paragraph>{row.description}</Typography.Paragraph>
                    <Typography.Paragraph>{row.updated_at}</Typography.Paragraph>
                </Card>
            ))}
            <Pagination
                className="little-top-space"
                size="small"
                current={pageObj.number}
                pageSize={pageObj.size}
                pageSizeOptions={[8, 16]}
                showSizeChanger={true}
                total={pageObj.total}
                showTotal={showTotal}
                onChange={handlePageChange}
            />
        </Drawer>
    );
}

export default DataSetSmallList;
