import { Modal, Form, Input, Button } from "antd";
import { createUser, existsUsername, fetchToken } from "./login-service.ts";
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

    const getToken = (user: LoginUser) => {
        fetchToken(user.username, user.password)
            .then(({ data }) => {
                setLogin(data.access);
                message.success("登录成功");
                loginForm.resetFields();
                // 获取用户信息
                fetchUserInfo(user.username);
                // 到首页
                navigate("/");
            })
            .catch(() => {
                message.error("账号或密码不正确");
            });
    };

    const handleLogin = (user: LoginUser) => {
        // 先检查用户是否存在
        existsUsername(user.username).then((isExists) => {
            if (isExists) {
                // 存在则登录
                getToken(user);
            } else {
                // 不存在则注册
                createUser(user.username, user.password).then(() => {
                    message.success("注册成功");
                    // 然后再登录
                    getToken(user);
                });
            }
        });
    };

    return (
        <Modal title="登录" closeIcon={false} open={!signInfo.logged} forceRender={true} footer={null}>
            <Form name="loginForm" form={loginForm} onFinish={handleLogin} labelCol={{ span: 4 }} autoComplete="off">
                <Form.Item label="账号" name="username" rules={[{ required: true, message: "请输入账号" }]}>
                    <Input allowClear />
                </Form.Item>
                <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}>
                    <Input.Password allowClear />
                </Form.Item>
                <Form.Item>
                    <Button style={{ marginTop: "1rem" }} block type="primary" htmlType="submit">
                        登录/注册
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
}

export default LoginDialog;
