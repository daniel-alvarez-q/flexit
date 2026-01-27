import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import type { WorkoutInstance } from "../workouts/workouts.types"
import type { ExerciseInstance } from "../exercises/exercises.types"
import axios_instance from "../../request_interceptor"
import ContentSection from "../../shared/components/ContentSection"
import EventMessage from "../../shared/components/EventMessage"
import HorizontalCard from "../../shared/components/HorizontalCard"
import './workout.css'

function Workout(){
    const [workout,setWorkout] = useState<WorkoutInstance>()
    const [exercises, setExercises] = useState<ExerciseInstance[]>([])
    const params = useParams()

    useEffect(()=>{
        axios_instance.get(`api/workout/${params.workoutId}`).then(async response =>{
            setWorkout(response.data)
            const retrieved_exercises = await axios_instance.get(`api/workout/${params.workoutId}/exercises`).then(response => {
                console.log(response.data);
                return response.data
            }).catch(error =>{
                console.log(error)
            })
            setExercises(retrieved_exercises)
        }).catch(error=>{
            console.error(error)
        })
    },[])

    const workout_details = (workout: WorkoutInstance)=>{
        return(
            <div className="workout-detail">
                <div className="workout-attribute">
                    <strong>Description: </strong>{workout.description}
                </div>
                <div className="workout-attribute">
                    <strong>Difficulty: </strong>{workout.difficulty}
                </div>
                {workout.source_url &&
                    <div className="workout-attribute">
                        <strong>Source: </strong><a href={workout.source_url}>{workout.source_url}</a>
                    </div>
                }
            </div>
        )
    }

    const exercise_list = (exercises:ExerciseInstance[]) => {
        return(
            <div className="workout-exercise-list">
                {exercises.map(exercise => 
                    <HorizontalCard key={exercise.id} id={exercise.id} title={exercise.name} body={exercise.description}></HorizontalCard>
                )}
            </div>
        )
    }
    

    return(
        <>
        { workout ?
        <>
            <div className="row">
                <div className="template-title">{`${workout.name}`}</div>
            </div>
            <div className="row g-3">
                <div className="col-12 col-sm-5">
                    <ContentSection>
                        {workout_details(workout)}
                    </ContentSection>
                </div>
                <div className="col-12 col-sm-7">
                    <ContentSection>
                        {exercise_list(exercises)}
                    </ContentSection>
                </div>
            </div>
        </>
        :
        <EventMessage style="loading"></EventMessage>}
        </>
        
    )
}

export default Workout