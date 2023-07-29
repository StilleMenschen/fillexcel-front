import { Button, notification, Tooltip, Typography } from "antd";
import { useState } from "react";
import { generateFile } from "./fill-rule-service.ts";
import { SnippetsFilled } from "@ant-design/icons";

interface GenerateButtonProps {
    requirementId: number;
    icon?: boolean;
}

/**
 * 独立的生成文件操作按钮，防止频繁点击
 */
function GenerateButton(props: GenerateButtonProps) {
    const [notify, contextHolder] = notification.useNotification();
    const [disabled, setDisabled] = useState(false);

    const handleGenerateFile = () => {
        setDisabled(true);
        generateFile(props.requirementId)
            .then(({ data }) => {
                notify.info({
                    message: "已提交生成请求",
                    description: (
                        <Typography.Paragraph>
                            稍后可在“生成记录”中下载生成后的文件
                            <br />
                            ID: {data.fileId}
                        </Typography.Paragraph>
                    ),
                    placement: "bottomRight",
                    duration: 6
                });
            })
            .catch(() => null)
            .finally(() => {
                setDisabled(false);
            });
    };

    return (
        <>
            {contextHolder}
            {props.icon ? (
                <Tooltip title="生成文件">
                    <Button
                        shape="circle"
                        type="primary"
                        icon={<SnippetsFilled style={{ fontSize: "1.12rem" }} />}
                        disabled={disabled}
                        onClick={handleGenerateFile}
                    />
                </Tooltip>
            ) : (
                <Button type="primary" block disabled={disabled} onClick={handleGenerateFile}>
                    生成文件
                </Button>
            )}
        </>
    );
}

export default GenerateButton;
