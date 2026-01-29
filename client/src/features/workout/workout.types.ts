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

export type ExerciseSessionLogInstance = {
    session:number;
    exercise:number;
    series?:number;
    repetitions?:number;
    weight?: number;
    duration?: number;
    distance?:number;
    notes?:string;
    log_time:string
}