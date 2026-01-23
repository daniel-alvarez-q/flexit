export type WorkoutInstance = {
    'id':number;
    'name':string;
    'description':string;
    'difficulty':string;
    'source_url':string;
    'user':number;
}

export type WorkoutCreate = {
    name:string;
    description:string;
    difficulty:string;
    source_url:string;
}