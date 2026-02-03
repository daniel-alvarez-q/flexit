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