import { useEffect, useState } from "react"
import axios_instance from "../../request_interceptor"
import type { ExerciseInstance } from "./exercises.types"
import Card from "../../shared/components/Card"
import EventMessage from "../../shared/components/EventMessage"

function Exercises(){

    const [exercises,setExercises] = useState<ExerciseInstance[]>([])

    useEffect(()=>{
        axios_instance.get('api/exercises').then(response => {
            setExercises(response.data)
        }).catch(error =>{
            console.error(`Exercises could not be retrieved: ${error}`)
        })
    },[])

    return(
        <>
            <div className="row">
                <div className="template-title">Exercises</div>
            </div>
            <div className="row justify-content-center g-4">
                { exercises.length >1 ?exercises.map(exercise =>
                    <div className="col-12 col-lg-3 custom-justify-content-center">
                        <Card 
                        key={exercise.id}
                        id={exercise.id} 
                        title={exercise.name} 
                        body={exercise.description} 
                        footer={`Last updated: ${exercise.updated_at}`} 
                        style="exercise"></Card>
                    </div>
                ):<EventMessage style="loading"></EventMessage>}
            </div>
        </>
    )
}

export default Exercises