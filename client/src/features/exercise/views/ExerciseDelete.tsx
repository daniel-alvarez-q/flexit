import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import Popup from "../../../shared/components/Popup";
import EventMessage from "../../../shared/components/EventMessage";
import '../exerciseDetail.css'

type ExerciseDeletePopupParams = {
    exerciseId:Number;
    displayHandler: React.Dispatch<boolean>;
    deleteFlagHandler:React.Dispatch<boolean>;
}


function ExerciseDeletePopup({exerciseId, displayHandler, deleteFlagHandler}:ExerciseDeletePopupParams){

    const {axios_instance} = useAuth()!
    const queryClient = useQueryClient()
    const [loading, setLoading] = useState<boolean>(false)
    const [serverError, setServerError] = useState<string|null>(null)

    const mutation = useMutation({
        mutationFn: ()=>{
            const response= axios_instance.delete(`api/exercise/${exerciseId}`).then(r=>r)
            return response
        },
        onSuccess: async()=>{
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey:['exercises']
                }
            ),
            ])
            deleteFlagHandler(true)
            displayHandler(false)

        },
        onError: (error)=>{
            setServerError(error.message)
            setLoading(false)
        }
    })

    function handleDelete(){
        setLoading(true)
        mutation.mutate()
    }

    return(
        <Popup title="Delete exercise" onClose={()=> displayHandler(false)}>
            <div className="delete-popup">
                <div className="delete-popup-text">
                    Delete this exercise?
                </div>
                {serverError && 
                    <EventMessage message={serverError} style="error compact"/>
                }
                <div className="delete-popup-actions">
                    <button onClick={()=>handleDelete()} disabled={loading}>Delete</button>
                    <button onClick={()=>displayHandler(false)} disabled={loading}>Cancel</button>
                </div>
            </div>
        </Popup>
    )
}

export default ExerciseDeletePopup