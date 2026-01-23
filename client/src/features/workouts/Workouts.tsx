import { useState, useEffect, type ReactEventHandler} from "react"
import type { WorkoutInstance } from "./workouts.types"
import axios_instance from "../../request_interceptor"
import Card from "../../shared/components/Card"
import EventMessage from "../../shared/components/EventMessage"
import Popup from "../../shared/components/Popup"

function Workouts(){
    const [data, setData] = useState<WorkoutInstance[]>([])
    const [newWorkout, setNewWorkout] = useState<Object>(
        {
            name:'',
            description:'',
            difficulty:'',
            source_url:''
        }
    )
    const [creatingWorkout, setCreatingWorkouts] = useState<boolean>(false)

    const fetchWorkouts = ()=>{
        axios_instance.get('api/workouts')
        .then(response => {
            setData(response.data);
        })
        .catch(error => {
            console.error('Error feching data: ', error);
        });
    }
    
    useEffect(() => {fetchWorkouts()},[])
         
    const handleWorkoutSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();
        try{
            const response = await axios_instance.post('api/workouts',newWorkout);
            console.log(response.data);
            setCreatingWorkouts(!creatingWorkout);
            setNewWorkout({
                name:'',
                description:'',
                difficulty:'',
                source_url:''
            });
            fetchWorkouts();
        }catch(error){
            console.log(`Error! ${error}`);
        }
    }

    const workout_list = (data:WorkoutInstance[]|null) => {
        if (data){
            let mapped_workouts = data.map(workout => 
                <Card key={workout.id} uri='workouts' id={workout.id} title={workout.name} footer={workout.source_url} body={workout.description} />
            )
            mapped_workouts.push(<Card key={mapped_workouts.length + 2} body='Create a new workout' style="action" onClick={()=>setCreatingWorkouts(!creatingWorkout)}></Card>)
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
                    <div className="form-group">
                        <div className="form-row">
                            <button className="btn-secondary btn-md">Create</button>
                        </div>
                    </div>
                </form>
    }

    return(
        <>
            <div className="row">
                <div className="template-title">Workouts</div>
            </div>
            <div className="row">
                {workout_list(data)}
            </div>
            {creatingWorkout &&
                <Popup title="New workout" onClose={()=> setCreatingWorkouts(!creatingWorkout)}>
                    {workout_form(handleWorkoutSubmit)}
                </Popup>
            }
        </>
    )
}

export default Workouts