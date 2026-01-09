import type { RouteObject } from "react-router-dom";
import RootLayout from "./RootLayout";
import Home from "../features/home";
import Login from "../features/login";
import Workouts from "../features/workouts";
import NotFound from "../shared/components/NotFound";
import Signup from "../features/signup";
import Exercises from "../features/exercises";

export const routes: RouteObject[] = [
    {
        element: <RootLayout />,
        children: [
            {'path': "/", element: <Home />},
            {'path': '/signup', element: <Signup />},
            {'path': "/login", element: <Login />},
            {'path': '/workouts', element: <Workouts />},
            {'path':'/exercises', element: <Exercises />},
            {'path': '*', element: <NotFound />}
        ],
    },
];