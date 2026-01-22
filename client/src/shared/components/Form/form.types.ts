import type { ReactEventHandler } from 'react'

export type FormElement = {
    elementType?:'input' | 'select' | 'textarea';
    title:string;
    type:string;
    name:string;
    id:string;
    options?:{value:string;label:string;}[];
    stateObject:{
        state:object,
        setState:React.Dispatch<React.SetStateAction<Object>>
    };
}

export type CustomFormProps = {
    handler: ReactEventHandler;
    elements: FormElement[]
}