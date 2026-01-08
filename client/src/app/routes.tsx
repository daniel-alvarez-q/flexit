import type { RouteObject } from "react-router-dom";
import RootLayout from "./RootLayout";
import Home from "../features/home";
import Login from "../features/login";
import Workouts from "../features/workouts";
import NotFound from "../shared/components/NotFound";

export const routes: RouteObject[] = [
    {
        element: <RootLayout />,
        children: [
            {'path': "/", element: <Home />},
            {'path': "/login", element: <Login />},
            {'path': '/workouts', element: <Workouts />},
            {'path': '*', element: <NotFound />}
        ],
    },
];