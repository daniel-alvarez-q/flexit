import type { Exercise } from "../../exercises/exercises.types";
import ContentSection from "../../../shared/components/ContentSection";
import EventMessage from "../../../shared/components/EventMessage";
import HorizontalCard from "../../../shared/components/HorizontalCard";
import './styles/workoutExerciseList.css'

type WorkoutExerciseListProps = {
    exercises:Exercise[];
    isError:boolean;
    isPending:boolean;
    error:Error|null;
    exerciseCreateFlagHandler:React.Dispatch<React.SetStateAction<boolean>>;
    exerciseAssociateFlagHandler:React.Dispatch<React.SetStateAction<boolean>>;
    exercisePreviewFlagHandler:React.Dispatch<React.SetStateAction<number|null>>;
}

function ExerciseListPanel({exercises, isError, isPending, error, exerciseCreateFlagHandler, exerciseAssociateFlagHandler, exercisePreviewFlagHandler}:WorkoutExerciseListProps){
    return(
        <ContentSection title="Exercises">
            <div className="workout-exercises">
                {isPending ?
                <EventMessage style="loading" />
                :isError?
                <EventMessage style="error" message={error!.message}/>
                :exercises.length < 1 ?
                <EventMessage style="warning" message="No exercises have been created for this workout"></EventMessage> 
                :<div className="workout-exercise-list">
                    {exercises.map(exercise => 
                        <HorizontalCard 
                        key={exercise.id} 
                        id={exercise.id} 
                        title={exercise.name} 
                        subtitle={exercise.focus_area_full ? exercise.category_full + ' | ' + exercise.focus_area_full : exercise.category_full} 
                        body={exercise.description} 
                        uri="/exercise" 
                        onClick={() => {exercisePreviewFlagHandler(exercise.id);}} />
                    )}
                </div>
                }
                <div className="row g-2">
                    <div className="col-6">
                        <button className="btn-full" onClick={() => exerciseCreateFlagHandler(true)}>Create new exercise</button>
                    </div>
                    <div className="col-6">
                        <button className="btn-full" onClick={() => exerciseAssociateFlagHandler(true)}>Add existing exercise</button>
                    </div>
                </div>
            </div>
        </ContentSection>
    )
}

export default ExerciseListPanel