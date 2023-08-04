import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Layout, message } from "antd";
import Headers from "../headers/headers.tsx";
import LoginDialog from "../login/login-dialog.tsx";
import { message as messageUnit } from "../../store/feedback.ts";

/**
 * 主页
 */
function Home() {
    // 关联上下文，获取到主题等样式的配置
    const [messageApi, contextHolder] = message.useMessage();

    useEffect(() => {
        // 绑定到代理对象中
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
    }, []);

    return (
        <>
            {contextHolder}
            <Layout className="a-hundred-percent-height">
                <Layout.Header>
                    <Headers />
                </Layout.Header>
                <Layout.Content className="little-top-space">
                    <Outlet />
                </Layout.Content>
            </Layout>
            <LoginDialog />
        </>
    );
}

export default Home;
