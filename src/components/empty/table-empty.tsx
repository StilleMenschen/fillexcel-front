import { Avatar, Typography } from "antd";

function TableEmpty() {
    return (
        <>
            <Avatar alt="empty" src="/vite.svg" />
            <Typography.Text>数据为空</Typography.Text>
        </>
    );
}

export default TableEmpty;
