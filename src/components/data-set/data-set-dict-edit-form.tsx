import { Button, Form, Input, Modal } from "antd";
import { DataSetDefine } from "./data-set-define-service.ts";
import { useEffect, useState } from "react";
import { message } from "../../store/feedback.ts";
import { useParams } from "react-router-dom";
import { addDataSetValue, getDataSetValue, updateDataSetValue } from "./data-set-value-service.ts";

interface DataSetDictEditFormProps {
    editId: number;
    dataSetDefineList: Array<DataSetDefine>;
    openEditForm: boolean;
    onClose: () => void;
    onDataSetDictQuery: () => void;
}

type DataSetDict = {
    [key: string]: string;
};

function DataSetDictEditForm(props: DataSetDictEditFormProps) {
    const { dataSetId } = useParams();
    const dataSetIdNum = Number(dataSetId);
    const [editForm] = Form.useForm();
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (props.editId <= 0) return;
        getDataSetValue(props.editId)
            .then(({ data }) => {
                editForm.setFieldsValue(JSON.parse(data.item));
            })
            .catch(() => null);
    }, []);

    const closeAndQuery = () => {
        setSaving(false);
        props.onDataSetDictQuery();
        props.onClose();
    };

    const handleSaveDataDictValue = (data: DataSetDict) => {
        setSaving(true);
        if (props.editId <= 0) {
            addDataSetValue({
                data_set_id: dataSetIdNum,
                item: JSON.stringify(data),
                data_type: "dict"
            })
                .then(() => {
                    message.success("保存成功");
                })
                .catch(() => null)
                .finally(closeAndQuery);
        } else {
            updateDataSetValue(props.editId, {
                data_set_id: dataSetIdNum,
                item: JSON.stringify(data),
                data_type: "dict"
            })
                .then(() => {
                    message.success("保存成功");
                })
                .catch(() => null)
                .finally(closeAndQuery);
        }
    };

    return (
        <Modal
            title={props.editId <= 0 ? "新增定义数据" : "编辑定义数据"}
            open={props.openEditForm}
            onCancel={props.onClose}
            forceRender={true}
            footer={null}
            maskClosable={false}
            width={600}>
            <Form
                name="dataSetDictEditForm"
                form={editForm}
                disabled={saving}
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 20 }}
                autoComplete="off"
                onFinish={handleSaveDataDictValue}>
                {props.dataSetDefineList.map((define) => (
                    <Form.Item
                        label={define.name}
                        key={define.id}
                        name={define.name}
                        rules={[{ required: true, message: `请输入${define.name}` }]}>
                        <Input placeholder={`请输入${define.name}`} />
                    </Form.Item>
                ))}
                <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
                    <Button block type="primary" htmlType="submit">
                        保存
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default DataSetDictEditForm;
