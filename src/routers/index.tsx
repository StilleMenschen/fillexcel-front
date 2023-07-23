import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../components/home/home.tsx";
import ErrorPage from "../components/error-page/error-page.tsx";
import Instructions from "../components/instructions/instructions.tsx";
import { fetchUserInfo } from "../store/account.ts";
import { setNavBar } from "../store/navigation.ts";
import DataSet from "../components/data-set/data-set.tsx";
import FillRuleList from "../components/fill-rule/fill-rule-list.tsx";
import ColumnRuleList from "../components/column-rule/column-rule-list.tsx";
import ColumnRuleAdd from "../components/column-rule/column-rule-add.tsx";
import ColumnRuleEdit from "../components/column-rule/column-rule-edit.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
        loader: () => {
            // 尝试获取用户信息
            fetchUserInfo(null);
            return null;
        },
        children: [
            {
                index: true,
                loader: () => {
                    setNavBar("Home");
                    return null;
                },
                element: <Instructions />
            },
            {
                path: "/fillRule",
                loader: () => {
                    setNavBar("fillRule");
                    return null;
                },
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        element: <FillRuleList />
                    },
                    {
                        path: ":fillRuleId",
                        element: <ColumnRuleList />
                    },
                    {
                        path: ":fillRuleId/add",
                        element: <ColumnRuleAdd />
                    },
                    {
                        path: ":fillRuleId/edit/:columnRuleId",
                        element: <ColumnRuleEdit />
                    }
                ]
            },
            {
                path: "/dataSet",
                loader: () => {
                    setNavBar("dataSet");
                    return null;
                },
                element: <DataSet />
            }
            /* {
                path: "/fileRecord",
                loader: () => {
                    setNavBar("fileRecord");
                    return null;
                },
                element: <FileRecordTable />
            }*/
        ]
    },
    {
        path: "/unauthorized",
        element: <img alt="Vite" src="/vite.svg" width="42%" height="42%" style={{ margin: "2% 30%" }} />
    }
]);

export default router;
