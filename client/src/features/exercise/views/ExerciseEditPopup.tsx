import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import Popup from "../../../shared/components/Popup";
import type { Exercise } from "../../exercises/exercises.types";
import { queryClient } from "../../../context/QueryContext";
import EventMessage from "../../../shared/components/EventMessage";

type ExerciseEditPopupParams = {
    exercise:Exercise;
    displayHandler: React.Dispatch<boolean>;
}

function ExerciseEditPopup({exercise, displayHandler}:ExerciseEditPopupParams){

    const [exerciseUpdate, setExerciseUpdate] = useState<Exercise>(exercise)
    const [error, setError] = useState<string|null>(null)

    const {axios_instance} = useAuth()!

    const mutation = useMutation({
        mutationKey:['exerciseUpdate'],
        mutationFn: (exercise:Exercise)=>{
            const response = axios_instance.patch(`api/exercise/${exercise.id}`, exercise).then(r=>r)
            return response
        },
        onSuccess: async()=>{
            await Promise.all([
                queryClient.invalidateQueries({queryKey:['exercise', exercise.id]}),
                queryClient.invalidateQueries({queryKey:['exercises']})
            ])
        }
    })

    function eventHandler(attr:string, event:string){
        setExerciseUpdate({...exerciseUpdate, [attr]: event})
        console.log(exerciseUpdate)
    }

    function submitHander(e:FormEvent){
        e.preventDefault()
        console.log(exerciseUpdate)
        mutation.mutate(exerciseUpdate)
        if(mutation.isError){
            setError(mutation.error.message)
        }else if(mutation.isSuccess){
            console.log('Here!')
            displayHandler(false)
        }
        
    }

    return(
        <Popup title="Exercise edit" onClose={() => displayHandler(false)}>
            <form onSubmit={(e)=>submitHander(e)}>
                <div className="mb-1">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" id="name" defaultValue={exerciseUpdate.name} onChange={(e)=> eventHandler('name', e.target.value)}/>
                </div>
                <div className="mb-1">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea name="description" id="description" className="form-control" defaultValue={exerciseUpdate.description} onChange={(e)=>eventHandler('description',e.target.value)}></textarea>
                </div>
                {error && 
                    <EventMessage message={error} style="error compact"/>
                }
                <div className="mb-1">
                    <button>Upgrade</button>
                </div>
            </form>
        </Popup>
    )
}

export default ExerciseEditPopup