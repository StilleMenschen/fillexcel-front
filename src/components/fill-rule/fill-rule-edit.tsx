import { useMemo, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Modal, Upload } from "antd";
import {
    AddOrUpdateRequirement,
    addRequirement,
    getRequirement,
    updateRequirement,
    uploadRequirementFile
} from "./fill-rule-service.ts";
import { message } from "../../store/feedback.ts";
import { useUser } from "../../store/account.ts";
import { RcFile, UploadFile } from "antd/es/upload/interface";
import { useImmer } from "use-immer";

export interface EditProps {
    editId: number | null;
    openEdit: boolean;
    setOpenEdit: CallableFunction;
    onFillRuleQuery: CallableFunction;
}

interface FileItem {
    id: string;
    name: string;
}

function FillRuleEdit(props: EditProps) {
    const { username } = useUser();
    const [editForm] = Form.useForm();
    const [fileItem, updateFileItem] = useImmer<FileItem>({ id: "", name: "" });
    const [fileList, setFileList] = useState<UploadFile[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleClose = () => {
        props.onFillRuleQuery();
        props.setOpenEdit(false);
    };

    useMemo(() => {
        if (!props.editId) {
            return false;
        }
        getRequirement(props.editId)
            .then(({ data }) => {
                const { id, file_id, original_filename, remark, start_line, line_number } = data;
                updateFileItem((draft) => {
                    draft.id = file_id;
                    draft.name = original_filename;
                });
                setFileList([{ uid: file_id, name: original_filename }]);
                editForm.setFieldValue("id", id);
                editForm.setFieldValue("remark", remark);
                editForm.setFieldValue("start_line", start_line);
                editForm.setFieldValue("line_number", line_number);
            })
            .catch(() => null);
        return true;
    }, [props.editId]);

    const handleSubmit = (data: AddOrUpdateRequirement) => {
        if (!fileItem.id || !fileItem.name) {
            message.error("请先选择Excel文件（.xlsx格式）");
            return;
        }
        const formData: AddOrUpdateRequirement = {
            username: username,
            remark: data.remark,
            file_id: fileItem.id,
            original_filename: fileItem.name,
            start_line: data.start_line,
            line_number: data.line_number
        };
        if (!props.editId) {
            addRequirement(formData)
                .then(() => {
                    message.success("保存成功");
                    handleClose();
                })
                .catch(() => null);
        } else {
            updateRequirement(props.editId, formData)
                .then(() => {
                    message.success("保存成功");
                    handleClose();
                })
                .catch(() => null);
        }
    };

    const handleFileUpload = (file: RcFile) => {
        if (file) {
            setUploading(true);
            uploadRequirementFile(username, file)
                .then(({ data }) => {
                    message.success(`上传文件成功: ${data.fileId}`);
                    updateFileItem((draft) => {
                        draft.id = data.fileId;
                        draft.name = file.name;
                    });
                    setFileList([file]);
                })
                .catch(() => null)
                .finally(() => setUploading(false));
        } else {
            message.error("请先选择Excel文件！");
        }
    };

    return (
        <Modal open={props.openEdit} onCancel={handleClose} title="新增填充规则" maskClosable={false} footer={null}>
            <Form
                form={editForm}
                onFinish={handleSubmit}
                initialValues={{
                    start_line: 1,
                    line_number: 2
                }}
                name="editForm"
                layout="vertical"
                autoComplete="off">
                {props.editId && (
                    <Form.Item name="id" label="ID" initialValue={props.editId}>
                        <Input disabled />
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
                <Form.Item name="files" label="Excel源文件">
                    <Upload
                        beforeUpload={(file) => {
                            handleFileUpload(file);
                            return false;
                        }}
                        onRemove={() => {
                            setFileList([]);
                        }}
                        fileList={fileList}
                        accept=".xlsx"
                        maxCount={1}>
                        <Button icon={<UploadOutlined />}>{uploading ? "文件上传中..." : "选择“.xlsx”格式的文件"} </Button>
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
