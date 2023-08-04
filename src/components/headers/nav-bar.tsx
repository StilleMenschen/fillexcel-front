import { useNavigate } from "react-router-dom";
import { Menu } from "antd";
import { InfoCircleFilled, ControlFilled, FileFilled, DatabaseFilled } from "@ant-design/icons";
import { paths, setNavBar, useNavBar } from "../../store/navigation.ts";
import { MenuClickEventHandler } from "rc-menu/lib/interface";

const menuList = [
    {
        key: "Home",
        label: "说明",
        icon: <InfoCircleFilled />
    },
    {
        key: "fillRule",
        label: "填充规则",
        icon: <ControlFilled />
    },
    {
        key: "dataSet",
        label: "数据集",
        icon: <DatabaseFilled />
    },
    {
        key: "fileRecord",
        label: "生成记录",
        icon: <FileFilled />
    }
];

function NavBar() {
    const navigate = useNavigate();
    const nav = useNavBar();

    /**
     * 更新导航并路由
     */
    const handleClick: MenuClickEventHandler = (e) => {
        setNavBar(e.key);
        navigate(paths.get(e.key) || "/");
    };

    return <Menu className="header" onClick={handleClick} selectedKeys={[nav]} mode="horizontal" items={menuList} />;
}

export default NavBar;
