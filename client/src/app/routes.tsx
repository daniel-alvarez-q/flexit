import type { RouteObject } from "react-router-dom";
import RootLayout from "./RootLayout";
import Home from "../features/home";
import Workouts from "../features/workouts";
import NotFound from "../shared/components/NotFound";
import Exercises from "../features/exercises";
import Logout from "../features/logout";
import WorkoutDetails from "../features/workout";
import ExerciseDetail from "../features/exercise";

export const routes: RouteObject[] = [
    {
        element: <RootLayout />,
        children: [
            {'path': "/", element: <Home />},
            {'path': '/logout', element: <Logout />},
            {'path': '/workouts', element: <Workouts />},
            {'path': '/workouts/:workoutId', element: <WorkoutDetails/>},
            {'path': '/exercises', element: <Exercises />},
            {'path': '/exercises/:exerciseId', element: <ExerciseDetail/>},
            {'path': '*', element: <NotFound />}
        ],
    },
];