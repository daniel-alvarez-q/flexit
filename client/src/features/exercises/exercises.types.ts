export type Exercise ={
    id:number;
    name:string;
    description:string;
    difficulty:string;
    category:string;
    series?:number;
    repetitions?:number;
    weight?:number;
    duration?:number;
    distance?:number;
    user:number;
    workouts:number[];
    created_at:string;
    updated_at:string
}

export type ExerciseCreate = Partial<Omit<Exercise, 'id'|'created_at'|'updated_at'|'user'>>