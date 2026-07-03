import { createBrowserRouter, Outlet } from "react-router";
import Login from "./features/auth/pages/login";
import Register from "./features/auth/pages/Register";
import Protected from "./features/auth/component/Protected";
import Home from "./features/interview/pages/Home";

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        path: "/",
        element: <Protected><Outlet /></Protected>,
        children: [
            {
                index: true,
                element: <Home />
            }
        ]
    }
])