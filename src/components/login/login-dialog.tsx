import { Modal, Form, Input, Button } from "antd";
import { fetchToken } from "./login-service.ts";
import { setLogin, useSignInfo } from "../../store/sign-info.ts";
import { fetchUserInfo } from "../../store/account.ts";
import { message } from "../../store/feedback.ts";
import { useNavigate } from "react-router-dom";

interface LoginUser {
    username: string;
    password: string;
}

function LoginDialog() {
    const [loginForm] = Form.useForm();
    const signInfo = useSignInfo();
    const navigate = useNavigate();

    const handleLogin = (user: LoginUser) => {
        // 处理登录逻辑，例如发送登录请求等
        fetchToken(user.username, user.password)
            .then(({ data }) => {
                setLogin(data.access);
                message.success("登录成功");
                // 获取用户信息
                fetchUserInfo(user.username);
                // 到首页
                navigate("/");
            })
            .catch(() => {
                message.error("账号或密码不正确");
            });
    };

    return (
        <Modal title="登录" closeIcon={false} open={!signInfo.logged} forceRender={true} footer={null}>
            <Form
                name="loginForm"
                form={loginForm}
                onFinish={handleLogin}
                initialValues={{ username: "jack", password: "4321dcba" }}
                labelCol={{ span: 4 }}
                autoComplete="off">
                <Form.Item label="账号" name="username" rules={[{ required: true, message: "请输入账号" }]}>
                    <Input allowClear />
                </Form.Item>
                <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}>
                    <Input.Password allowClear />
                </Form.Item>
                <Form.Item>
                    <Button style={{ marginTop: "1rem" }} block type="primary" htmlType="submit">
                        登录
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default LoginDialog;
