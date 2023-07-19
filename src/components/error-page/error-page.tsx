import { useRouteError } from "react-router-dom";
import { Button, Empty } from "antd";

interface Error {
    statusText: string | null;
    message: string | null;
}

export default function ErrorPage() {
    const error = useRouteError() as Error;

    return (
        <Empty
            style={{ paddingTop: "2rem" }}
            description={<span>哎呀！出现意外错误... {error.statusText || error.message}</span>}>
            <Button type="link" onClick={() => window.history.back()}>
                返回上一页
            </Button>
        </Empty>
    );
}
