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
                element: <h1 style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Homepage stay here</h1>
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