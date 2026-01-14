import { useEffect, useState } from "react"
import axios_instance from "../../request_interceptor"
import type { exercise_overview } from "./exercises.types"
import Card from "../../shared/components/Card"

function Exercises(){

    const [exercises,setExercises] = useState<exercise_overview[]>([])

    useEffect(()=>{
        axios_instance.get('api/exercises').then(response => {
            setExercises(response.data)
        }).catch(error =>{
            console.error(`Exercises could not be retrieved: ${error}`)
        })
    },[])

    return(
        <>
            <h1>Exercises</h1>
            <div className="row">
                {exercises.map(exercise =>
                    <Card id={exercise.id} 
                    title={exercise.name} 
                    body={exercise.description} 
                    footer={`Last updated: ${exercise.updated_at}`} 
                    style="exercise"></Card>
                )}
            </div>
        </>
    )
}

export default Exercises