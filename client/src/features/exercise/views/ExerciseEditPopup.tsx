import Popup from "../../../shared/components/Popup";

type ExerciseEditPopupParams = {
    displayHandler: React.Dispatch<boolean>;
}

function ExerciseEditPopup({displayHandler}:ExerciseEditPopupParams){
    return(
        <Popup title="Exercise edit" onClose={() => displayHandler(false)}>
            Test
        </Popup>
    )
}

export default ExerciseEditPopup