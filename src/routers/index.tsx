import { createBrowserRouter } from "react-router-dom";
import Home from "../components/home/home.tsx";
import ErrorPage from "../components/error-page/error-page.tsx";
import Instructions from "../components/instructions/instructions.tsx";
import { fetchUser } from "../store/account.ts";
import { setNavBar } from "../store/navigation.ts";
import FillRule from "../components/fill-rule/fill-rule.tsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
        loader: () => {
            fetchUser(null);
            return null;
        },
        children: [
            {
                path: "/",
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
                element: <FillRule />
            }
            /* {
                path: "/dataSet",
                loader: () => {
                    setNavBar("dataSet");
                    return null;
                },
                element: <DataSet />
            },
            {
                path: "/fileRecord",
                loader: () => {
                    setNavBar("fileRecord");
                    return null;
                },
                index: true,
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
