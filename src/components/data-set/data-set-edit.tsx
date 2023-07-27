import { Button, Card, Form, Input, Modal, Select } from "antd";
import { AddOrUpdateDataSet, addDataSet, getDataSet, updateDataSet } from "./data-set-service";
import { useUser } from "../../store/account";
import { message } from "../../store/feedback";
import { useEffect } from "react";

interface EditProps {
    editId: number;
    openEdit: boolean;
    setOpenEdit: CallableFunction;
    onDataSetQuery: CallableFunction;
}

function DataSetEdit(props: EditProps) {
    const { username } = useUser();
    const [editForm] = Form.useForm();

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
        if (props.editId <= 0) {
            addDataSet({ ...data, username })
                .then(() => {
                    message.success("保存成功");
                    handleClose();
                })
                .catch(() => null);
        } else {
            updateDataSet(props.editId, { ...data, username })
                .then(() => {
                    message.success("保存成功");
                    handleClose();
                })
                .catch(() => null);
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
                initialValues={{
                    description: "",
                    data_type: "string"
                }}
                name="editForm"
                layout="vertical"
                autoComplete="off">
                {props.editId > 0 && (
                    <Form.Item name="id" label="ID" initialValue={props.editId}>
                        <Input disabled />
                    </Form.Item>
                )}
                <Form.Item name="description" label="描述">
                    <Input multiple />
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
            <Card
                size="small"
                title="数据类型说明"
                extra={
                    <a href="#" onClick={() => message.info("Card")}>
                        More
                    </a>
                }>
                <p>Card content</p>
                <p>Card content</p>
                <p>Card content</p>
            </Card>
        </Modal>
    );
}

export default DataSetEdit;
