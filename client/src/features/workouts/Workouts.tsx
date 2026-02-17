import { useState} from "react"
import WorkoutList from "./views/WorkoutList"
import Card from "../../shared/components/Card"
import WorkoutCreateForm from "./views/WorkoutCreateForm"

function Workouts(){
    //Data-bounded states
    const [error, setError] = useState<string|null>(null)
    const [creatingWorkout, setCreatingWorkouts] = useState<boolean>(false)
   

    return(
        <>
            <div className="row">
                <div className="template-title">Workouts</div>
            </div>
            <div className="row justify-content-center g-4">
                <WorkoutList />
                <div className="col-12 col-lg-3 custom-justify-content-center">
                    <Card body='Create a new workout' style="action" onClick={()=>setCreatingWorkouts(!creatingWorkout)}></Card>
                </div>
            </div>
            {creatingWorkout &&
                <WorkoutCreateForm error={error} errorHandler={setError} displayFlagHandler={setCreatingWorkouts}/>
            }
        </>
    )
}

export default Workouts