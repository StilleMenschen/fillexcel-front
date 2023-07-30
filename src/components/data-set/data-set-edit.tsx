import { Button, Form, Input, Modal, Select, Typography } from "antd";
import { addDataSet, AddOrUpdateDataSet, getDataSet, updateDataSet } from "./data-set-service";
import { useUser } from "../../store/account";
import { message } from "../../store/feedback";
import { useEffect, useState } from "react";
import { addDataSetDefine, AddOrUpdateDataSetDefine, getDataSetDefineList } from "./data-set-define-service.ts";

interface EditProps {
    editId: number;
    openEdit: boolean;
    onClose: () => void;
    onDataSetQuery: () => void;
}

function DataSetEdit(props: EditProps) {
    const { username } = useUser();
    const [editForm] = Form.useForm();
    const [saving, setSaving] = useState(false);
    const [showDataType, setShowDataType] = useState(false);

    useEffect(() => {
        if (props.editId <= 0) return;
        getDataSet(props.editId)
            .then(({ data }) => {
                loadDataDefine(data.data_type);
                editForm.setFieldValue("description", data.description);
                editForm.setFieldValue("data_type", data.data_type);
                setShowDataType(data.data_type == "dict");
            })
            .catch(() => null);
    }, [props.editId]);

    const loadDataDefine = (dateType: string) => {
        if (props.editId <= 0 || dateType != "dict") return;
        getDataSetDefineList(props.editId, 1, 64)
            .then(({ data }) => {
                const defines = data.data.map((it) => it.name).join(",");
                editForm.setFieldValue("data_define", defines);
            })
            .catch(() => null);
    };

    const validateDataDefine = (dateType: string) => {
        if (dateType != "dict") return true;
        const defines = editForm.getFieldValue("data_define") as string;
        const names = defines.split(",");
        const nameSet = new Set(names);
        if (names.length != nameSet.size) {
            message.error("不能定义重复的字段属性");
            return false;
        }
        return true;
    };

    const saveDataDefine = (dataSetId: number, dateType: string) => {
        if (dataSetId <= 0 || dateType != "dict") return Promise.resolve(undefined);
        const defines = editForm.getFieldValue("data_define") as string;
        const defineList: Array<AddOrUpdateDataSetDefine> = defines.split(",").map((name) => ({
            data_set_id: dataSetId,
            name: name,
            data_type: "string"
        }));
        return addDataSetDefine(defineList);
    };

    const handleClose = () => {
        props.onDataSetQuery();
        props.onClose();
    };

    const handleSubmit = (data: AddOrUpdateDataSet) => {
        // 检查重复的字段属性定义
        if (!validateDataDefine(data.data_type)) {
            return;
        }
        setSaving(true);
        if (props.editId <= 0) {
            addDataSet({ ...data, username })
                .then(({ data }) => {
                    // 保存数据定义
                    return saveDataDefine(data.id, data.data_type);
                })
                .then(() => {
                    message.success("保存成功");
                    handleClose();
                })
                .catch(() => null)
                .finally(() => setSaving(false));
        } else {
            updateDataSet(props.editId, { ...data, username })
                .then(() => {
                    // 保存数据定义
                    return saveDataDefine(props.editId, data.data_type);
                })
                .then(() => {
                    message.success("保存成功");
                    handleClose();
                })
                .catch(() => null)
                .finally(() => setSaving(false));
        }
    };

    return (
        <Modal
            open={props.openEdit}
            onCancel={handleClose}
            title={props.editId <= 0 ? "新增数据集" : "编辑数据集"}
            forceRender={true}
            maskClosable={false}
            footer={null}>
            <Form
                name="dataSetEditForm"
                form={editForm}
                onFinish={handleSubmit}
                layout="vertical"
                autoComplete="off"
                disabled={saving}
                initialValues={{
                    description: "",
                    data_type: "string"
                }}>
                {props.editId > 0 && (
                    <Form.Item name="id" label="ID" initialValue={props.editId}>
                        <Input disabled />
                    </Form.Item>
                )}
                <Form.Item name="description" label="描述">
                    <Input.TextArea
                        autoSize={{ minRows: 2, maxRows: 8 }}
                        showCount
                        maxLength={248}
                        placeholder="请输入数据描述"
                    />
                </Form.Item>
                <Form.Item label="数据类型" name="data_type">
                    <Select
                        options={[
                            { value: "string", label: "字符串" },
                            { value: "dict", label: "字典" }
                        ]}
                        onChange={(value) => setShowDataType(value == "dict")}
                    />
                </Form.Item>
                {showDataType && (
                    <Form.Item
                        label="数据定义"
                        name="data_define"
                        rules={[
                            { pattern: /^[a-zA-Z]+(,[a-zA-Z]+)*$/g, message: "字段属性以英文单词表示，多个以英文逗号隔开" }
                        ]}>
                        <Input.TextArea
                            autoSize={{ minRows: 2, maxRows: 8 }}
                            showCount
                            maxLength={512}
                            placeholder="请输入数据定义（字段属性以英文单词表示，多个以英文逗号隔开）"
                        />
                    </Form.Item>
                )}
                <Form.Item>
                    <Button block size="large" type="primary" htmlType="submit">
                        保存
                    </Button>
                </Form.Item>
            </Form>
            <Typography.Title level={4}>数据类型说明</Typography.Title>
            <Typography.Paragraph>
                字符串：
                <br />
                表示一组自定义的词或句子，如一组水果：“橘子”、“香橙”、“椰子”；
            </Typography.Paragraph>
            <Typography.Paragraph>
                字典：
                <br />
                表示一组自定义属性的对象描述，如一组学生信息：(name=小张, age=18)、(name=小明, age=20)、(name=大刘, age=22)。
            </Typography.Paragraph>
        </Modal>
    );
}

export default DataSetEdit;
