import { Layout, message } from "antd";
import Headers from "../headers/headers.tsx";
import { Outlet } from "react-router-dom";
import LoginDialog from "../login/login-dialog.tsx";
import { useEffect } from "react";
import { message as messageUnit } from "../../store/feedback.ts";

/**
 * 主页
 */
function Home() {
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        messageUnit.success = (msg) => {
            messageApi.success(msg);
        };
        messageUnit.info = (msg) => {
            messageApi.info(msg);
        };
        messageUnit.warning = (msg) => {
            messageApi.warning(msg);
        };
        messageUnit.error = (msg) => {
            messageApi.error(msg);
        };
        messageUnit.loading = (msg) => {
            messageApi.loading(msg);
        };
    }, [messageApi]);

    return (
        <>
            {contextHolder}
            <Layout className="fills-full-height">
                <Layout.Header>
                    <Headers />
                </Layout.Header>
                <Layout.Content>
                    <Outlet />
                </Layout.Content>
            </Layout>
            <LoginDialog />
        </>
    );
}

export default Home;
