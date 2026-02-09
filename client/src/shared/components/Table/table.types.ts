export type columnConfig<Type> = {
    key:keyof Type;
    header:string;
    uri?:string;   
}

export type tableProps<Type> = {
    columns: columnConfig<Type>[];
    data: Type[]
    rowKey?: keyof Type;
}