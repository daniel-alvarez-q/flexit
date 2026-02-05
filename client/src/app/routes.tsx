import type { RouteObject } from "react-router-dom";
import RootLayout from "./RootLayout";
import Home from "../features/home";
import Signin from "../features/signin";
import Workouts from "../features/workouts";
import NotFound from "../shared/components/NotFound";
import Signup from "../features/signup";
import Exercises from "../features/exercises";
import Logout from "../features/logout";
import WorkoutDetails from "../features/workout";

export const routes: RouteObject[] = [
    {
        element: <RootLayout />,
        children: [
            {'path': "/", element: <Home />},
            {'path': '/signup', element: <Signup />},
            {'path': '/signin', element: <Signin />},
            {'path': '/logout', element: <Logout />},
            {'path': '/workouts', element: <Workouts />},
            {'path': '/workouts/:workoutId', element: <WorkoutDetails/>},
            {'path':'/exercises', element: <Exercises />},
            {'path': '*', element: <NotFound />}
        ],
    },
];