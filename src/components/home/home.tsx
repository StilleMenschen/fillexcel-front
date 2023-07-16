import { Layout, message } from "antd";
import Headers from "../headers/headers.tsx";
import { Outlet } from "react-router-dom";
import LoginDialog from "../login/login-dialog.tsx";
import { useMemo } from "react";
import { message as messageUnit } from "../../store/feedback.ts";

/**
 * 主页
 */
function Home() {
    const [messageApi, contextHolder] = message.useMessage();

    useMemo(() => {
        messageUnit.success = (msg) => {
            void messageApi.success(msg);
        };
        messageUnit.info = (msg) => {
            void messageApi.info(msg);
        };
        messageUnit.warning = (msg) => {
            void messageApi.warning(msg);
        };
        messageUnit.error = (msg) => {
            void messageApi.error(msg);
        };
        messageUnit.loading = (msg) => {
            void messageApi.loading(msg);
        };
        return true;
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
