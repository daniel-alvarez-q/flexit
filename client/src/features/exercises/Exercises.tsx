import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import type { Exercise } from "./exercises.types"
import Card from "../../shared/components/Card"
import EventMessage from "../../shared/components/EventMessage"

function Exercises(){

    const {axios_instance} = useAuth()!
    const [exercises,setExercises] = useState<Exercise[]>([])

    useEffect(()=>{
        axios_instance.get('api/exercises').then(response => {
            console.log('Exercises response:', response.data)
            if (Array.isArray(response.data)) {
                setExercises(response.data)
            } else {
                console.error('Expected array but got:', typeof response.data, response.data)
            }
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
                { Array.isArray(exercises) ? exercises.length ? exercises.map(exercise =>
                    <div className="col-12 col-lg-3 custom-justify-content-center" key={exercise.id}>
                        <Card 
                        id={exercise.id} 
                        title={exercise.name} 
                        body={exercise.description} 
                        footer={`Last updated: ${exercise.updated_at}`} 
                        style="exercise"></Card>
                    </div>
                )
                :<EventMessage style="warning" message="You have not defined any exercises, create one through an existing workout."></EventMessage>
                :<EventMessage style="loading"></EventMessage>}
            </div>
        </>
    )
}

export default Exercises