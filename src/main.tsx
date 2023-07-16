import React from "react";
import ReactDOM from "react-dom/client";
import router from "./routers/index.tsx";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider, theme } from "antd";
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
        <ConfigProvider theme={webTheme}>
            <RouterProvider router={router} />
        </ConfigProvider>
    </React.StrictMode>
);
