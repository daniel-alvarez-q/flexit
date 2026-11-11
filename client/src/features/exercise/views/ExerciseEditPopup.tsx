import { useState, type FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import type { Exercise } from "../../exercises/exercises.types";
import type { Workout } from '../../workouts/workout.types'
import Select from "react-select";
import EventMessage from "../../../shared/components/EventMessage";
import Popup from "../../../shared/components/Popup";

type ExerciseEditPopupParams = {
    exercise:Exercise;
    workouts:Array<Workout> | undefined;
    displayHandler:React.Dispatch<boolean>;
}

type WorkoutOption = {
    value:number;
    label:string
}

function ExerciseEditPopup({exercise, workouts, displayHandler}:ExerciseEditPopupParams){

    const [exerciseUpdate, setExerciseUpdate] = useState<Exercise>(exercise)
    const [error, setError] = useState<string|null>(null)
    const [loading,setLoading] = useState<boolean>(false)
    const {axios_instance} = useAuth()!
    const queryClient = useQueryClient()

    //Workout select
    let workout_options:Array<WorkoutOption> = []
    
    
    if(workouts){
        workout_options = workouts.map((w:Workout) =>{
            return {value:w.id, label:w.name.trim()}
        })
    }

    const mutation = useMutation({
        mutationKey:['exerciseUpdate'],
        mutationFn: (exercise:Exercise)=>{
            const response = axios_instance.patch(`api/exercise/${exercise.id}`, exercise).then(r=>r)
            return response
        },
        onSuccess: async()=>{
            await Promise.all([
                queryClient.invalidateQueries({queryKey:['exercise', String(exercise.id)]}),
            ])
            displayHandler(false)
            setLoading(false)
        },
        onError: (error)=>{
            setError(error.message)
            setLoading(false)
        }
    })

    function eventHandler(attr:string, event:string | ReadonlyArray<Object>){
        if (attr=='workouts' && Array.isArray(event)) {
            let updated_workouts = event.map((o:WorkoutOption) => o.value)
            setExerciseUpdate({...exerciseUpdate, 'workouts': updated_workouts})
        }else{
            setExerciseUpdate({...exerciseUpdate, [attr]: event})
        }
    }

    function submitHander(e:FormEvent){
        e.preventDefault()
        setError(null)
        setLoading(true)
        console.log(exerciseUpdate)
        mutation.mutate(exerciseUpdate)      
    }

    return(
        <Popup title="Update exercise details" onClose={() => displayHandler(false)}>
            <form onSubmit={(e)=>submitHander(e)}>
                <div className="mb-1">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" id="name" defaultValue={exerciseUpdate.name} onChange={(e)=> eventHandler('name', e.target.value)}/>
                </div>
                <div className="mb-1">
                    <label htmlFor="description" className="form-label">Description</label>
                    <textarea name="description" id="description" className="form-control" defaultValue={exerciseUpdate.description} onChange={(e)=>eventHandler('description',e.target.value)}></textarea>
                </div>
                <div className="mb-1">
                {workouts &&
                    <>
                    <label htmlFor="workouts" className="form-label">Workouts</label>
                    <Select 
                        options={workout_options} 
                        unstyled
                        className="multiselect-custom"
                        classNamePrefix="multiselect-custom" 
                        isMulti 
                        name="workouts" 
                        defaultValue={exerciseUpdate.workouts?.map(w => workout_options.find((value) => value.value == w)!)} onChange={e => eventHandler('workouts', e)}/>
                    </>
                }
                </div>
                {error && 
                    <EventMessage message={error} style="error compact"/>
                }
                <div className="mb-1">
                    <button disabled={loading}>Update</button>
                </div>
            </form>
        </Popup>
    )
}

export default ExerciseEditPopup