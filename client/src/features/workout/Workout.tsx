import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import type { WorkoutInstance } from "../workouts/workouts.types"
import axios_instance from "../../request_interceptor"
import ContentSection from "../../shared/components/ContentSection"
import EventMessage from "../../shared/components/EventMessage"

function Workout(){
    const [workout,setWorkout] = useState<WorkoutInstance>()
    const params = useParams()

    useEffect(()=>{
        axios_instance.get(`api/workout/${params.workoutId}`).then(response =>{
            console.log(response.data)
            setWorkout(response.data)
        }).catch(error=>{
            console.error(error)
        })
    },[])
    

    return(
        <>
        { workout ?
            <div className="row">
                <div className="template-title">{`${workout.name}`}</div>
            </div>
        :
        <EventMessage style="loading"></EventMessage>}
        <div className="row">
                <ContentSection>
                <p>Section 1</p>
            </ContentSection>
            <ContentSection>
                <p>Section 2</p>
            </ContentSection>
        </div>
        </>
        
    )
}

export default Workout