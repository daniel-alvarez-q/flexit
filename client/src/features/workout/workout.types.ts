export type WorkoutSession = {
    id:number;
    workout:number;
    workout_name?:string;
    exercise_logs:ExerciseLog[];
    user:number;
    start_time:string;
    end_time:string;
    workout_data?: object;
}

export type WorkoutSessionCreate = Partial<Omit<WorkoutSession, 'id'>>

export type ExerciseLog = {
    id:number;
    session:number;
    exercise:number;
    exercise_name?:string;
    exercise_category?:string;
    series?:number;
    repetitions?:number;
    weight?: number;
    duration?: number;
    distance?:number;
    notes?:string;
    log_time:string
}