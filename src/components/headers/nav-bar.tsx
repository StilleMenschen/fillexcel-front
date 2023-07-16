import { useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import { setNavBar, useNavBar } from "../../store/navigation.ts";

const menuList: MenuProps["items"] = [
    {
        key: "Home",
        label: "说明"
    },
    {
        key: "fillRule",
        label: "填充规则"
    },
    {
        key: "dataSet",
        label: "数据集"
    },
    {
        key: "fileRecord",
        label: "生成记录"
    }
];

const paths = new Map([
    ["Home", "/"],
    ["fillRule", "/fillRule"],
    ["dataSet", "/dataSet"],
    ["fileRecord", "/fileRecord"]
]);

function NavBar() {
    const navigate = useNavigate();
    const nav = useNavBar();

    const onClick: MenuProps["onClick"] = (e) => {
        setNavBar(e.key);
        navigate(paths.get(e.key) || "/");
    };

    return <Menu className="header" onClick={onClick} selectedKeys={[nav]} mode="horizontal" items={menuList} />;
}

export default NavBar;
