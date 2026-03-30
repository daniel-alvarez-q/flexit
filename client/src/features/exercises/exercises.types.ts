import type { ExerciseLog } from "../workout/workout.types";
import type { Workout } from "../workouts/workouts.types";

type ExerciseKpis = {
    associated_workouts: number;
    total_logs: number;
    logs_current_month: number;
}

export type Exercise ={
    id:number;
    name:string;
    description:string;
    difficulty:string;
    category:string;
    category_full?:string;
    focus_area?:string;
    focus_area_full?:string;
    series?:number;
    repetitions?:number;
    weight?:number;
    duration?:number;
    distance?:number;
    user:number;
    workouts?:number[];
    kpis:ExerciseKpis;
    logs:ExerciseLog[];
    workouts_full:Workout[];
    created_at:string;
    updated_at:string
}

export type ExerciseCreate = Partial<Omit<Exercise, 'id'|'created_at'|'updated_at'|'user'>>