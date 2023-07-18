import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
import router from "./routers/index.tsx";
import zhCN from "antd/locale/zh_CN";
import "./index.css";

const webTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
        colorPrimary: "#fa8c16",
        colorInfo: "#13c2c2",
        wireframe: false
    }
};

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <ConfigProvider theme={webTheme} locale={zhCN}>
            <RouterProvider router={router} />
        </ConfigProvider>
    </React.StrictMode>
);
