export type User = {
    id:number;
    username:string;
    email:string;
    password:string;
    first_name?:string;
    last_name?:string;
    is_staff:boolean;
}

export type UserCreate = Omit<User,'id'|'is_staff'>