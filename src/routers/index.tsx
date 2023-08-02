import { createBrowserRouter, Outlet } from "react-router-dom";
import Home from "../components/home/home.tsx";
import ErrorPage from "../components/error-page/error-page.tsx";
import Instructions from "../components/instructions/instructions.tsx";
import { fetchUserInfo } from "../store/account.ts";
import { setNavBar } from "../store/navigation.ts";
import DataSetList from "../components/data-set/data-set-list.tsx";
import FillRuleList from "../components/fill-rule/fill-rule-list.tsx";
import ColumnRuleList from "../components/column-rule/column-rule-list.tsx";
import ColumnRuleAdd from "../components/column-rule/column-rule-add.tsx";
import ColumnRuleEdit from "../components/column-rule/column-rule-edit.tsx";
import FileRecordList from "../components/fille-record/file-recod-list.tsx";
import DataSetStringEdit from "../components/data-set/data-set-string-edit.tsx";
import DataSetDictEdit from "../components/data-set/data-set-dict-edit.tsx";
import { fetchGenerateRule } from "../store/generate-rule.ts";
import Examples from "../components/instructions/examples.tsx";

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
                path: "/examples/:key",
                loader: () => {
                    setNavBar("Home");
                    return null;
                },
                element: <Examples />
            },
            {
                path: "/fillRule",
                loader: async () => {
                    await fetchGenerateRule();
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
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        element: <DataSetList />
                    },
                    {
                        path: "string/:dataSetId",
                        element: <DataSetStringEdit />
                    },
                    {
                        path: "dict/:dataSetId",
                        element: <DataSetDictEdit />
                    }
                ]
            },
            {
                path: "/fileRecord",
                loader: () => {
                    setNavBar("fileRecord");
                    return null;
                },
                element: <FileRecordList />
            }
        ]
    },
    {
        path: "/unauthorized",
        element: <img alt="Vite" src="/vite.svg" width="42%" height="42%" style={{ margin: "2% 30%" }} />
    }
]);

export default router;
