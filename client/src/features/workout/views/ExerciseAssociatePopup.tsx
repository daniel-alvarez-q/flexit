import Popup from "../../../shared/components/Popup";
import type { Exercise } from "../../exercises/exercises.types";
import './styles/exerciseAssociate.css'

type ExerciseAssociatePopupParams = {
    exercises:Array<Exercise>
    closeHandler:React.Dispatch<React.SetStateAction<boolean>>
}

function ExerciseAssociatePopup({exercises, closeHandler}:ExerciseAssociatePopupParams){

    return(
        <Popup title="Associate existing exercise" onClose={() => closeHandler(false)}>
            <div className="exercise-selection-list">
                {exercises.map((e:Exercise) => 
                    <div className="option" key={e.id}>
                        <div className="description">
                            <div className="exercise-name">
                                {`${e.name} `}
                            </div>
                            <div className="exercise-details">
                                {`${e.category_full?.trim()}`} {e.focus_area_full && e.focus_area_full.trim()?.length > 0 && `- ${ e.focus_area_full}`}
                            </div>
                        </div>
                        <div className="check-select">
                            <input type="checkbox" className="custom-check" name="" id=""/>
                        </div>
                    </div>    
                )}
            </div>
        </Popup>
    )
}

export default ExerciseAssociatePopup