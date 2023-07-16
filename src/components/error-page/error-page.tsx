import { useRouteError } from "react-router-dom";
import { Card, Space } from "antd";

interface Error {
    statusText: string | null;
    message: string | null;
}

export default function ErrorPage() {
    const error = useRouteError() as Error;

    return (
        <Space direction="vertical" size="middle" style={{ display: "flex" }}>
            <Card title="Card" size="small">
                <p>哎呀!</p>
                <p>出现意外错误。</p>
            </Card>
            <Card title="Card" size="small">
                <i>{error.statusText || error.message}</i>
            </Card>
            <Card title="Card" size="small">
                <a href="#" onClick={() => window.history.back()}>
                    返回上一页
                </a>
            </Card>
        </Space>
    );
}
