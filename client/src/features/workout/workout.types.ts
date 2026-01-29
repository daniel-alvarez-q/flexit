export type WorkoutSessionInstance = {
    id:number;
    workout:number;
    workout_name?:string;
    exercise_logs:Object[];
    user:number;
    start_time:string;
    end_time:string;
    workout_data?: object;
}