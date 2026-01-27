export type ExerciseInstance ={
    id?:number;
    name:string;
    description:string;
    difficulty:string;
    category:string;
    series?:number;
    repetitions?:number;
    weight?:number;
    duration?:number;
    distance?:number;
    user?:number;
    workouts?:number[];
    created_at:string;
    updated_at:string
}