import { useRef, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Upload } from "antd";
import { AddOrUpdateRequirement, addRequirement, uploadFile } from "./fill-rule-service.ts";
import { message } from "../../store/feedback.ts";
import { useUser } from "../../store/account.ts";
import { RcFile, UploadFile } from "antd/es/upload/interface";

export interface EditProps {
    id?: number | null;
    openEdit: boolean;
    setOpenEdit: CallableFunction;
    handleQuery: CallableFunction;
}

function FillRuleEdit(props: EditProps) {
    const { username } = useUser();
    const [editForm] = Form.useForm();
    const [filename, setFilename] = useState<string>("");
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const fileId = useRef<string>("");

    const handleClose = () => {
        editForm.resetFields();
        setFileList([]);
        props.setOpenEdit(false);
        props.handleQuery();
    };

    const onSubmit = (data: AddOrUpdateRequirement) => {
        if (!fileId || !filename) {
            message.error("请先选择Excel文件（.xlsx格式）");
            return;
        }
        addRequirement({
            id: props.id,
            username: username,
            remark: data.remark,
            file_id: fileId.current,
            original_filename: filename,
            start_line: data.start_line,
            line_number: data.line_number
        })
            .then(() => {
                message.success("保存成功");
                handleClose();
            })
            .catch(() => null);
    };

    const onFileUpload = (file: RcFile) => {
        if (file) {
            setUploading(true);
            uploadFile(username, file)
                .then(({ data }) => {
                    fileId.current = data.fileId;
                    message.success(`上传文件成功: ${data.fileId}`);
                    setFilename(file.name);
                    setFileList([file]);
                })
                .catch(() => null)
                .finally(() => setUploading(false));
        } else {
            message.error("请先选择Excel文件！");
        }
    };

    return (
        <Modal open={props.openEdit} onCancel={handleClose} title={"新增填充规则"} maskClosable={false} footer={null}>
            <Form
                form={editForm}
                onFinish={onSubmit}
                initialValues={{
                    start_line: 1,
                    line_number: 2
                }}
                name="editForm"
                layout="vertical"
                autoComplete="off">
                {props.id && (
                    <Form.Item name="id" label="ID">
                        <Input value={props.id} disabled />
                    </Form.Item>
                )}
                <Form.Item name="remark" label="备注" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item
                    wrapperCol={{ span: 24 }}
                    name="start_line"
                    label="起始行（整数）"
                    rules={[
                        { required: true, message: "起始行必填" },
                        { type: "integer", min: 1, max: 42, message: "起始行必须是1-42之间的整数" }
                    ]}>
                    <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                    wrapperCol={{ span: 24 }}
                    name="line_number"
                    label="填充行数（整数）"
                    rules={[
                        { required: true, message: "行数必填" },
                        { type: "integer", min: 1, max: 200, message: "行数必须是1-200之间的整数" }
                    ]}>
                    <InputNumber style={{ width: "100%" }} />
                </Form.Item>
                <Form.Item
                    name="files"
                    label="Excel源文件"
                    rules={[{ required: true, message: "请先选择Excel文件（.xlsx格式）" }]}>
                    <Upload
                        beforeUpload={(file) => {
                            onFileUpload(file);
                            return false;
                        }}
                        onRemove={() => {
                            setFileList([]);
                        }}
                        fileList={fileList}
                        accept=".xlsx"
                        maxCount={1}>
                        <Button icon={<UploadOutlined />}>{uploading ? "文件上传中" : "选择“.xlsx”格式的文件"} </Button>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button style={{ width: "100%" }} size="large" type="primary" htmlType="submit">
                        保存
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default FillRuleEdit;
