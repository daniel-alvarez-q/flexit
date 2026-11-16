import { useState } from "react";
import Popup from "../../../shared/components/Popup";
import type { Exercise } from "../../exercises/exercises.types";
import './styles/exerciseAssociate.css'
import EventMessage from "../../../shared/components/EventMessage";

type ExerciseAssociatePopupParams = {
    exercises:Array<Exercise>
    closeHandler:React.Dispatch<React.SetStateAction<boolean>>
}

function ExerciseAssociatePopup({exercises, closeHandler}:ExerciseAssociatePopupParams){
    const [selectedExercises, setSelectedExercises] = useState<Array<Number>>([])

    function handleSelection (id:number, e:boolean) {
        if(e){ 
            setSelectedExercises(selectedExercises.concat([id]))
        }else{
            setSelectedExercises(selectedExercises.filter((i)=>i!==id))
        }
        console.log(selectedExercises)
    }

    return(
        <Popup title="Add existing exercise" onClose={() => closeHandler(false)}>
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
                                <input type="checkbox" onChange={(e)=> handleSelection(ex.id, e.currentTarget.checked)} className="custom-check" name={`exercise-select-${ex.id}`} id={`exercise-select-${ex.id}`}/>
                            </div>
                        </div>    
                    )
                    :
                    <EventMessage style="warning" message="There are no exercises available"/>
                }
            </div>
            <div className="divider"/>
            <div className="row g2">
                <div className="col-4">
                    <div className="selected-count">
                        {selectedExercises.length} selected
                    </div>
                </div>
                <div className="col-8">
                    <button className="btn-full" disabled={exercises.length === 0}>
                        Add {selectedExercises.length} exercises
                    </button>
                </div>
            </div>
        </Popup>
    )
}

export default ExerciseAssociatePopup