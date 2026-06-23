import { createBrowserRouter, Outlet } from "react-router";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/Register";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Outlet />,
        children: [
            {
                index: true,
                element: <div>Home Page (Go to /login)</div>
            },
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            }
        ]
    }
])