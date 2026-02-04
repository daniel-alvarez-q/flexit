import { useState, useEffect, type ReactEventHandler} from "react"
import type { Workout, WorkoutCreate } from "./workouts.types"
import axios_instance from "../../request_interceptor"
import Card from "../../shared/components/Card"
import EventMessage from "../../shared/components/EventMessage"
import Popup from "../../shared/components/Popup"

function Workouts(){
    //Data-bounded states
    const [error, setError] = useState<string|null>(null)
    const [workouts, setWorkouts] = useState<Workout[]>([])
    const [newWorkout, setNewWorkout] = useState<WorkoutCreate>(
        {
            name:'',
            description:'',
            difficulty:''
        }
    )
    const [creatingWorkout, setCreatingWorkouts] = useState<boolean>(false)

    //Effects and data load
    const fetchWorkouts = ()=>{
        setError(null)
        axios_instance.get('api/workouts')
        .then(response => {
            setWorkouts(response.data);
        })
        .catch(error => {
            console.error('Error feching data: ', error);
        });
    }
    
    useEffect(() => {fetchWorkouts()},[])

    //Event handlers 
    const handleWorkoutSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        setError(null)
        try{
            const response = await axios_instance.post('api/workouts',newWorkout);
            console.log(response.data);
            setCreatingWorkouts(!creatingWorkout);
            setNewWorkout({
                name:'',
                description:'',
                difficulty:''
            });
            fetchWorkouts();
        }catch(error){
            console.log(`Error! ${error.response.data}`);
            setError(JSON.stringify(error.response.data))
        }
    }

    const handleFormState = () =>{
        let state:boolean = false
        if(!newWorkout.name.length || !newWorkout.difficulty.length){
            state=true
        }
        return state
    }

    //Visual elements
    const workout_list = (data:Workout[]|null) => {
        if (data){
            let mapped_workouts = data.map(workout => 
                <div className="col-12 col-lg-3 custom-justify-content-center">
                    <Card key={workout.id} uri='workouts' id={workout.id} title={workout.name} footer={workout.created_at} body={workout.description} />
                </div>
            )
            mapped_workouts.push(<div className="col-12 col-lg-3 custom-justify-content-center"><Card key={mapped_workouts.length + 2} body='Create a new workout' style="action" onClick={()=>setCreatingWorkouts(!creatingWorkout)}></Card></div>)
            return mapped_workouts
        }else{
            return <EventMessage style="loading"></EventMessage>
        }
    }

    const workout_form = (handler:ReactEventHandler) =>{
        return <form onSubmit={handler}>
                    <div className="form-group">
                        <div className="form-row">
                            <label htmlFor="name">Workout title</label>
                        </div>
                        <div className="form-row">
                            <input type="text" name="name" id="name" onChange={(e) => setNewWorkout({...newWorkout, name:e.target.value})}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-row">
                            <label htmlFor="">Workout description</label>
                        </div>
                        <div className="form-row">
                            <input type="text" name="description" id="description" onChange={(e) => setNewWorkout({...newWorkout, description:e.target.value})}/>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-row">
                            <label htmlFor="difficulty">Difficulty</label>
                        </div>
                        <div className="form-row">
                            <select name="difficulty" id="difficulty" onChange={(e) => setNewWorkout({...newWorkout, difficulty:e.target.value})}>
                                <option value="ext">Extreme</option>
                                <option value="hig">High</option>
                                <option value="med">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="form-row">
                            <label htmlFor="source_url">Source url</label>
                        </div>
                        <div className="form-row">
                            <input type="url" name="source_url" id="source_url" onChange={(e) => setNewWorkout({...newWorkout, source_url:e.target.value})}/>
                        </div>
                    </div>
                    { error &&
                        <div className="form-group">
                            <div className="form-row">
                                <EventMessage message={error} style="error compact"></EventMessage>
                            </div>
                        </div>
                    }
                    <div className="form-group">
                        <div className="form-row">
                            <button className="btn-full" disabled={handleFormState()}>Create</button>
                        </div>
                    </div>
                </form>
    }

    return(
        <>
            <div className="row">
                <div className="template-title">Workouts</div>
            </div>
            <div className="row justify-content-center g-4">
                {workout_list(workouts)}
            </div>
            {creatingWorkout &&
                <Popup title="New workout" onClose={()=> {setCreatingWorkouts(!creatingWorkout); setError(null)}}>
                    {workout_form(handleWorkoutSubmit)}
                </Popup>
            }
        </>
    )
}

export default Workouts