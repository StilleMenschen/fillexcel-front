import { useRouteError } from "react-router-dom";
import { Button, Empty, Typography } from "antd";

interface Error {
    statusText: string | null;
    message: string | null;
}

export default function ErrorPage() {
    // 路由时渲染组件出现的异常
    const error = useRouteError() as Error;

    return (
        <Empty
            style={{ paddingTop: "2rem" }}
            description={<Typography.Text>哎呀！出现意外错误。 {error.statusText || error.message}</Typography.Text>}>
            <Button type="link" onClick={() => window.history.back()}>
                返回上一页
            </Button>
        </Empty>
    );
}
