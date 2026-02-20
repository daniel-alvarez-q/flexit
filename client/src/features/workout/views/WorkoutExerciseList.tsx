import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import type { Exercise } from "../../exercises/exercises.types";
import EventMessage from "../../../shared/components/EventMessage";
import HorizontalCard from "../../../shared/components/HorizontalCard";
import './styles/workoutExerciseList.css'

type WorkoutExerciseListProps = {
    workoutId:number;
    exercisesHandler: React.Dispatch<Record<number,Exercise>>;
    exerciseCreateFlagHandler:React.Dispatch<React.SetStateAction<boolean>>;
    exercisePreviewFlagHandler:React.Dispatch<React.SetStateAction<number|null>>;
}

function WorkoutExerciseList({workoutId, exercisesHandler, exerciseCreateFlagHandler, exercisePreviewFlagHandler}:WorkoutExerciseListProps){

    const {axios_instance} = useAuth()!
    //const exerciseCategories:Record<string,string> = {'str':'Strength', 'car':'Cardio','res':'Resistance','oth':'Other'}

    const {isPending, isError, error, data:workoutExercises} = useQuery(
        {
            queryKey:['workoutExercises', workoutId],
            queryFn: async ():Promise<Record<number,Exercise>> => {
                const response = await axios_instance.get(`/api/workout/${workoutId}/exercises`).then(r=>r)
                // const workoutExercises:Exercise[] = response.data.map((e:Exercise)=>{
                //     return {...e, category_full:exerciseCategories[e.category]}

                console.log(response)
                const workoutExercises = response.data.reduce((acc:Record<number,Exercise>,exercise:Exercise) =>{
                    acc[exercise.id] = exercise
                    return acc
                },{})
                console.log(workoutExercises)
                exercisesHandler(workoutExercises)
                return workoutExercises
            }
        }
    )

    if(isPending){
        return(
            <EventMessage style="loading" />
        )
    }

    if(isError){
        return(
            <EventMessage style="error" message={error.message}/>
        )
    }

    return(
        <div className="workout-exercises">
                {Object.keys(workoutExercises).length < 1 ?
                <EventMessage style="warning" message="No exercises have been created for this workout"></EventMessage> 
                :<div className="workout-exercise-list">
                    {Object.values(workoutExercises).map(exercise => 
                        <HorizontalCard 
                        key={exercise.id} 
                        id={exercise.id} 
                        title={exercise.name} 
                        subtitle={exercise.category} 
                        body={exercise.description} 
                        uri="/exercise" 
                        onClick={() => {exercisePreviewFlagHandler(exercise.id);}} />
                    )}
                </div>
                }
                <div>
                    <button className="btn-lg" onClick={() => exerciseCreateFlagHandler(true)}>Add new exercise</button>
                </div>
        </div>
    )
}

export default WorkoutExerciseList