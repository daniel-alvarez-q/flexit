import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import Popup from "../../../shared/components/Popup";
import EventMessage from "../../../shared/components/EventMessage";
import '../exerciseDetail.css'

type ExerciseDeletePopupParams = {
    exerciseId:Number;
    displayHandler: React.Dispatch<boolean>;
}


function ExerciseDeletePopup({exerciseId, displayHandler}:ExerciseDeletePopupParams){

    const {axios_instance} = useAuth()!
    const queryClient = useQueryClient()
    const mutation = useMutation({
        mutationFn: ()=>{
            const response= axios_instance.delete(`api/exercise/${exerciseId}`).then(r=>r)
            return response
        },
        onSuccess: async()=>{
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey:['exercise', String(exerciseId)]
                }
            ),
            ])
            displayHandler(false)
        },
        onError: (error)=>{
            console.log(error)
        }
    })

    function handleDelete(){
        mutation.mutate()
    }

    return(
        <Popup title="Delete exercise" onClose={()=> displayHandler(false)}>
            <div className="delete-popup">
                <div className="delete-popup-text">
                    Delete this exercise?
                </div>
                <div className="delete-popup-actions">
                    <button onClick={()=>handleDelete()}>Delete</button>
                    <button onClick={()=>displayHandler(false)}>Cancel</button>
                </div>
            </div>
        </Popup>
    )
}

export default ExerciseDeletePopup