import { useEffect, useState, type FormEvent } from "react"
import { useParams } from "react-router-dom"
import type { WorkoutInstance } from "../workouts/workouts.types"
import type { ExerciseInstance } from "../exercises/exercises.types"
import axios_instance from "../../request_interceptor"
import ContentSection from "../../shared/components/ContentSection"
import EventMessage from "../../shared/components/EventMessage"
import HorizontalCard from "../../shared/components/HorizontalCard"
import Popup from "../../shared/components/Popup"
import Form from "../../shared/components/Form"
import './workout.css'

function Workout(){
    const [workout,setWorkout] = useState<WorkoutInstance|null>(null)
    const [exercises, setExercises] = useState<ExerciseInstance[]|null>(null)
    const [exercise, setExercise] = useState<Partial<ExerciseInstance>>({
        'workouts':[],
        'name':'',
        'description':'',
        'difficulty': '',
        'category':'',
        'series':0,
        'repetitions':0,
        'duration':0,
        'distance':0,
    })
    const [creatingExercise, setCreatingExercise] = useState<boolean>(false)
    const [activeSession, setActiveSession] = useState<boolean>(false)
    const [error, setError] = useState<string|null>(null)
    const params = useParams()


    const fetch_workout = () => {
        axios_instance.get(`api/workout/${params.workoutId}`).then(async response =>{
            setWorkout(response.data)
            const retrieved_exercises = await axios_instance.get(`api/workout/${params.workoutId}/exercises`).then(response => {
                return response.data
            }).catch(error =>{
                setError(error.message)
                console.log(error)
            })
            setExercises(retrieved_exercises)
        }).catch(error=>{
            setError(error.message)
            console.error(error)
        })
    }

    useEffect(()=>{
        fetch_workout()
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
                        <strong>Source: </strong><a href={workout.source_url} target="_blank">{workout.source_url}</a>
                    </div>
                }
            </div>
        )
    }

    const exercise_list = (exercises:ExerciseInstance[]|null) => {
        return(
            <div className="workout-exercises">
                {!exercises ?
                <EventMessage style="loading"></EventMessage>
                : exercises.length<1 ?
                <EventMessage style="warning" message="No exercises have been created for this workout"></EventMessage> 
                :<div className="workout-exercise-list">
                    {exercises.map(exercise => 
                        <HorizontalCard key={exercise.id} id={exercise.id} title={exercise.name} body={exercise.description}></HorizontalCard>
                    )}
                </div>
                }
                <div>
                    <button className="btn-lg" onClick={() => setCreatingExercise(!creatingExercise)}>Add new exercise</button>
                </div>
            </div>
        )
    }

    const handleExerciseSubmit = (e:FormEvent)=>{
        e.preventDefault()
        if(workout){
            exercise.workouts?.push(workout.id)
            console.log(exercise)
            axios_instance.post('api/exercises', exercise).then(response => {
            console.log(response)
            setCreatingExercise(!creatingExercise)
            setExercise({
                'workouts':[],
                'name':'',
                'description':'',
                'difficulty': '',
                'category':'',
                'series':0,
                'repetitions':0,
                'duration':0,
                'distance':0,
            })
            fetch_workout()
        }).catch(error =>{
            setError(error.message)
            console.log(error)
        })
        }else{
            setError('No workout data is available!')
        }
    }

    const exercise_form = () => {
        return(
            <form onSubmit={(e) => handleExerciseSubmit(e)}>
                <div className="form-group">
                    <div className="form-row">
                        <label htmlFor="name">Name</label>
                    </div>
                    <div className="form-row">
                        <input type="text" name="name" id="name" onChange={(e) => setExercise({...exercise, 'name':e.target.value})}/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-row">
                        <label htmlFor="description">Description</label>
                    </div>
                    <div className="form-row">
                        <input type="text" name="description" id="description" onChange={(e)=> setExercise({...exercise, 'description':e.target.value})}/>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-row">
                        <label htmlFor="difficulty">Difficulty</label>
                    </div>
                    <div className="form-row">
                        <select name="difficulty" id="difficulty" onChange={(e) => setExercise({...exercise, 'difficulty':e.target.value})}>
                            <option value="ext">Extreme</option>
                            <option value="hig">High</option>
                            <option value="med">Medium</option>
                            <option value="low">Low</option>

                        </select>
                    </div>
                </div>
                <div className="form-group">
                    <div className="form-row">
                        <label htmlFor="category">Category</label>
                    </div>
                    <div className="form-row">
                        <select name="category" id="category" onChange={(e) => setExercise({...exercise, 'category':e.target.value})}>
                            <option value="oth">Other</option>
                            <option value="str">Strength</option>
                            <option value="car">Cardio</option>
                            <option value="flx">Flexibility</option>
                            <option value="res">Resistance</option>
                        </select>
                    </div>
                </div>
                {exercise.category === 'str' ?
                    <>
                        <div className="form-group">
                            <div className="form-row">
                                <label htmlFor="series">Series</label>
                            </div>
                            <div className="form-row">
                                <input type="number" name="series" id="series" onChange={(e) => setExercise({...exercise, 'series': Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-row">
                                <label htmlFor="repetitions">Repetitions</label>
                            </div>
                            <div className="form-row">
                                <input type="number" name="repetitions" id="repetitions" onChange={(e) => setExercise({...exercise, 'repetitions': Number(e.target.value)})}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="form-row">
                                <label htmlFor="weight">Weight</label>
                            </div>
                            <div className="form-row">
                                <input type="number" name="weight" id="weight" onChange={(e) => setExercise({...exercise, 'weight': Number(e.target.value)})}/>
                            </div>
                        </div>
                    </>
                : exercise.category === 'car' ?
                    <>
                    <div className="form-group">
                        <div className="form-row">
                            <label htmlFor="distance">Distance (km)</label>
                        </div>
                        <div className="form-row">
                            <input type="number" name="distance" id="distance" onChange={(e) => setExercise({...exercise, 'distance': Number(e.target.value)})}/>
                        </div>
                    </div>      
                    <div className="form-group">
                        <div className="form-row">
                            <label htmlFor="duratin">Duration (minutes)</label>
                        </div>
                        <div className="form-row">
                            <input type="number" name="duration" id="duration" onChange={(e) => setExercise({...exercise, 'duration': Number(e.target.value)})}/>
                        </div>
                    </div>              
                    </>
                : exercise.category === 'flx'
                }
                {error &&
                    <EventMessage message={error} style="error solid"></EventMessage>
                }
                <div className="form-group">
                    <div className="form-row">
                        <button className="btn-md">Create</button>
                    </div>
                </div>
            </form>
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
                    <div className="row g-3">
                        <div className="col-12">
                            <ContentSection title="Workout details">
                                {workout_details(workout)}
                            </ContentSection>
                        </div>
                        <div className="col-12">
                            <div className="col-12">
                        <ContentSection title="Workout sessions">
                            <button className="btn-lg">Start a new session</button>
                        </ContentSection>
                </div>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-sm-7">
                    <ContentSection title="Exercises">
                        {exercise_list(exercises)}
                    </ContentSection>
                </div>
            </div>
        </>
        :
        <EventMessage style="loading"></EventMessage>}
        {creatingExercise &&
            <Popup title="New exercise" onClose={()=> {setCreatingExercise(!creatingExercise); setError(null)}}>
                {exercise_form()}
            </Popup>
            }
        </>
        
    )
}

export default Workout