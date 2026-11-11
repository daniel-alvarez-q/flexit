export type Workout = {
    'id':number;
    'name':string;
    'description':string;
    'difficulty':string;
    'source_url'?:string;
    'user':number;
    'created_at':string
}

export type WorkoutCreate = Omit<Workout, 'id'|'user'|'created_at'>

export type WorkoutSession = {
    id:number;
    workout:number;
    workout_name?:string;
    exercise_logs:ExerciseLog[];
    exercise_instances:number;
    user:number;
    start_time:string;
    end_time:string;
    duration?:number;
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