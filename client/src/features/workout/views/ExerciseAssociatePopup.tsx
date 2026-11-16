import Popup from "../../../shared/components/Popup";
import type { Exercise } from "../../exercises/exercises.types";

type ExerciseAssociatePopupParams = {
    exercises:Array<Exercise>
    closeHandler:React.Dispatch<React.SetStateAction<boolean>>
}

function ExerciseAssociatePopup({exercises, closeHandler}:ExerciseAssociatePopupParams){
    
    return(
        <Popup title="Associate existing exercise" onClose={() => closeHandler(false)}>
            <ol>
                {exercises.map((e:Exercise) => <li>{e.name}</li>)}
            </ol>
        </Popup>
    )
}

export default ExerciseAssociatePopup