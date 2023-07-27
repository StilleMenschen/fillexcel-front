import { Button, Form, Input, Modal, Select, Typography } from "antd";
import { addDataSet, AddOrUpdateDataSet, getDataSet, updateDataSet } from "./data-set-service";
import { useUser } from "../../store/account";
import { message } from "../../store/feedback";
import { useEffect, useState } from "react";

interface EditProps {
    editId: number;
    openEdit: boolean;
    setOpenEdit: CallableFunction;
    onDataSetQuery: CallableFunction;
}

function DataSetEdit(props: EditProps) {
    const { username } = useUser();
    const [editForm] = Form.useForm();
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (props.editId <= 0) {
            return;
        }
        getDataSet(props.editId)
            .then(({ data }) => {
                editForm.setFieldValue("description", data.description);
                editForm.setFieldValue("data_type", data.data_type);
            })
            .catch(() => null);
    }, [props.editId]);

    const handleClose = () => {
        props.onDataSetQuery();
        props.setOpenEdit(false);
    };

    const handleSubmit = (data: AddOrUpdateDataSet) => {
        setSaving(true);
        if (props.editId <= 0) {
            addDataSet({ ...data, username })
                .then(() => {
                    message.success("保存成功");
                    handleClose();
                })
                .catch(() => null)
                .finally(() => setSaving(false));
        } else {
            updateDataSet(props.editId, { ...data, username })
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
            title={`${props.editId <= 0 ? "新增" : "编辑"}数据集`}
            forceRender={true}
            maskClosable={false}
            footer={null}>
            <Form
                form={editForm}
                onFinish={handleSubmit}
                name="editForm"
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
                    />
                </Form.Item>
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
