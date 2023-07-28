import { Breadcrumb, Button, Card, Col, Divider, Input, InputRef, List, Popconfirm, Row, Space, Typography } from "antd";
import { Link, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
    addDataSetValue,
    DataSet,
    DataSetValue,
    deleteDataSetValue,
    getDataSet,
    getDataSetValueList,
    updateDataSetValue
} from "./data-set-service.ts";
import { useImmer } from "use-immer";
import { CheckCircleFilled, CloseCircleFilled, EditFilled, MinusCircleFilled } from "@ant-design/icons";
import { message } from "../../store/feedback.ts";

const showTotal = (total: number) => `总计 ${total}`;

interface EditInputProps {
    data: DataSetValue;
    onChange: (value: string) => void;
    onUpdate: (id: number, item: DataSetValue) => void;
    onDelete: (id: number) => void;
}

interface AddInputProps {
    onAdd: (value: string) => void;
}

function EditInput(props: EditInputProps) {
    const [editable, setEditable] = useState(false);
    const dirty = useRef(props.data.item);
    const input = useRef<InputRef | null>(null);

    const handleAdd = () => {
        // 校验后再保存
        if (props.data.item && props.data.item.length > 0) {
            props.onUpdate(props.data.id, props.data);
            setEditable(false);
        } else {
            message.warning("请填写内容后再保存");
        }
    };

    const handleCancel = () => {
        // 缓存修改前的数据
        props.onChange(dirty.current);
        setEditable(false);
    };

    return (
        <Space.Compact block className="little-top-space">
            <Input
                ref={(e) => (input.current = e)}
                style={{ textAlign: "center" }}
                value={props.data.item}
                readOnly={!editable}
                onChange={(e) => props.onChange(e.target.value)}
                onKeyDown={(e) => {
                    if (e.code == "Enter" || e.code == "NumpadEnter") {
                        handleAdd();
                    } else if (e.code == "Escape") {
                        handleCancel();
                    }
                }}
            />
            {editable ? (
                <Button icon={<CheckCircleFilled />} onClick={handleAdd} />
            ) : (
                <Button
                    icon={<EditFilled />}
                    onClick={() => {
                        // 缓存修改前的数据
                        dirty.current = props.data.item;
                        input.current?.focus();
                        setEditable(true);
                    }}
                />
            )}
            {editable && <Button icon={<CloseCircleFilled />} onClick={handleCancel} />}
            <Popconfirm
                title="确定要删除此记录吗？"
                placement="left"
                cancelButtonProps={{
                    danger: true
                }}
                okType="default"
                onCancel={() => props.onDelete(props.data.id)}
                okText="取消"
                cancelText="删除">
                <Button title="删除" icon={<MinusCircleFilled />} />
            </Popconfirm>
        </Space.Compact>
    );
}

function AddInput(props: AddInputProps) {
    const [value, setValue] = useState("");
    const handleAdd = () => {
        if (!value || value == "") return;
        props.onAdd(value);
        setValue("");
    };

    return (
        <Space.Compact block>
            <Input
                placeholder="输入内容后按下回车添加"
                style={{ textAlign: "center" }}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                    if (e.code == "Enter" || e.code == "NumpadEnter") {
                        handleAdd();
                    } else if (e.code == "Escape") {
                        setValue("");
                    }
                }}
            />
            <Button title="确定" icon={<CheckCircleFilled />} onClick={handleAdd} />
            <Button
                title="删除"
                icon={<MinusCircleFilled />}
                onClick={() => {
                    setValue("");
                }}
            />
        </Space.Compact>
    );
}

function DataSetStringEdit() {
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

    const handleAddItem = (value: string) => {
        addDataSetValue({
            data_set_id: dataSet?.id || -1,
            data_type: dataSet?.data_type || "string",
            item: value
        })
            .then(() => {
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

    const handleDeleteDataSetValue = (id: number) => {
        deleteDataSetValue(id)
            .then(() => {
                message.warning("已删除");
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
                            position: "both",
                            align: "end"
                        }}
                        footer={<AddInput onAdd={handleAddItem} />}
                        renderItem={(row, idx) => (
                            <EditInput
                                data={row}
                                onChange={(val) => {
                                    updateDataSetValueList((draft) => {
                                        const item = draft[idx];
                                        item.item = val;
                                    });
                                }}
                                onUpdate={handleUpdateItem}
                                onDelete={handleDeleteDataSetValue}
                            />
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
                        <Typography.Paragraph>最后一个输入框输入内容后，按下回车键（Enter）添加</Typography.Paragraph>
                    </Card>
                </Col>
            </Row>
        </>
    );
}

export default DataSetStringEdit;
