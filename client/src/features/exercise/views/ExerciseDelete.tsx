import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import Popup from "../../../shared/components/Popup";
import EventMessage from "../../../shared/components/EventMessage";

type ExerciseDeletePopupParams = {
    exerciseId:Number;
    displayHandler: React.Dispatch<boolean>;
}


function ExerciseDeletePopup({exerciseId, displayHandler}:ExerciseDeletePopupParams){
    return(
        <Popup title="Delete exercise" onClose={()=> displayHandler(false)}>
            Test
        </Popup>
    )
}

export default ExerciseDeletePopup