import { useUser } from "../../store/account.ts";
import { setLogout } from "../../store/sign-info.ts";
import { MenuProps, Avatar, Dropdown, Typography } from "antd";

const items: MenuProps["items"] = [
    {
        key: "1",
        label: <Typography.Text>Profile</Typography.Text>
    },
    {
        key: "2",
        label: <Typography.Text>My account</Typography.Text>
    },
    {
        key: "3",
        label: (
            <Typography.Text
                style={{ display: "block", width: "100%", height: "100%" }}
                onClick={() => {
                    setLogout();
                }}>
                退出
            </Typography.Text>
        )
    }
];

export default function UserBar() {
    const { username } = useUser();

    return (
        <>
            <Typography.Text strong style={{ paddingRight: "0.36rem" }}>
                {username}
            </Typography.Text>
            <Dropdown menu={{ items }} placement="bottomRight" arrow>
                <Avatar className="header-avatar" src="/react.svg" alt="avatar" />
            </Dropdown>
        </>
    );
}
