import { useParams } from "react-router-dom";
import type { Params } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import type { Exercise } from "../exercises/exercises.types";


function ExerciseDetail(){
    const params:Readonly<Params<string>> = useParams()
    const {axios_instance} = useAuth()!

    const {isPending, isError, error, data:exercise} = useQuery({
        queryKey:['exercise', params.exerciseId],
        queryFn: async ():Promise<Exercise> =>{
            const response = await axios_instance.get(`api/exercise/${params.exerciseId}`)
            console.log(response)
            return response.data
        }
    })
    
    return(
    <>
        <div className="row">
                <div className="template-title">{exercise?.name}</div>
            </div>
        <p>{JSON.stringify(exercise)}</p>
    </>
    )
}

export default ExerciseDetail