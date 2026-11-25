import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import type { Exercise } from "../../exercises/exercises.types";
import type { Workout } from "../../workouts/workout.types";
import Popup from "../../../shared/components/Popup";
import EventMessage from "../../../shared/components/EventMessage";
import './styles/exerciseAssociate.css'

type ExerciseAssociatePopupParams = {
    workout: Workout;
    exercises:Array<Exercise>
    closeHandler:React.Dispatch<React.SetStateAction<boolean>>
}

function ExerciseAssociatePopup({workout, exercises, closeHandler}:ExerciseAssociatePopupParams){
    const [selectedExercises, setSelectedExercises] = useState<Array<number>>(workout.exercises ?? [])
    const [patchError, setPatchError] = useState<string|null>(null)
    const {axios_instance} = useAuth()!
    const queryClient = useQueryClient()
    const mutate = useMutation({
        mutationFn: (ex:Array<Number>)=>{
            let data = {
                'exercises':ex
            }
            return axios_instance.patch(`api/workout/${workout.id}`, data=data)
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey:['workout', workout.id]
            })
            queryClient.invalidateQueries({
                queryKey:['exercises']
            })
            closeHandler(false)
        },
        onError: (error)=>{
            setPatchError(error.message)
        }
    })

    function handleClose(){
        closeHandler(false)
    }

    function disabledSubmitState(){
        return exercises.length === 0 || selectedExercises.length === 0 || mutate.isPending
    }
    
    function handleSelection(id:number, e:boolean) {
        if(e){ 
            setSelectedExercises(selectedExercises.concat([id]))
        }else{
            setSelectedExercises(selectedExercises.filter((i)=>i!==id))
        }
    }

    function handleSubmit(){
        mutate.mutate(selectedExercises)
    }

    return(
        <Popup title="Add existing exercise" onClose={handleClose}>
            <div className="exercise-selection-list">
                {exercises.length ? 
                    exercises.map((ex:Exercise) => 
                        <div className="option" key={ex.id}>
                            <div className="description">
                                <div className="exercise-name">
                                    {`${ex.name} `}
                                </div>
                                <div className="exercise-details">
                                    {`${ex.category_full?.trim()}`} {ex.focus_area_full && ex.focus_area_full.trim()?.length > 0 && `- ${ ex.focus_area_full}`}
                                </div>
                            </div>
                            <div className="check-select">
                                <input type="checkbox" checked={selectedExercises.includes(ex.id)} onChange={(e)=> handleSelection(ex.id, e.currentTarget.checked)} className="custom-check" name={`exercise-select-${ex.id}`} id={`exercise-select-${ex.id}`}/>
                            </div>
                        </div>    
                    )
                    :
                    <EventMessage style="warning" message="There are no exercises available"/>
                }
            </div>
            <div className="divider"/>
            {patchError && <EventMessage message={patchError}/>}
            <div className="row g2">
                <div className="col-4">
                    <div className="selected-count">
                        {selectedExercises.length} selected
                    </div>
                </div>
                <div className="col-8">
                    <button type="button" className="btn-full" disabled={disabledSubmitState()} onClick={() => handleSubmit()}>
                        Associate {selectedExercises.length} exercises
                    </button>
                </div>
            </div>
        </Popup>
    )
}

export default ExerciseAssociatePopup