import { useState, useEffect} from "react"
import type { Workout } from "./workouts.types"
import instance from "../../auth_interceptor"
import Card from "../../shared/components/Card"

function Workouts(){
    const [data, setData] = useState<Workout[]>([])
    
    useEffect(() => {
        instance.get('api/workouts')
        .then(response => {
            setData(response.data);
        })
        .catch(error => {
            console.error('Error feching data: ', error);
        });
        }, []);

    return(
        <>
            <h1>Workouts!</h1>
            <div className="row">
                {data.length > 1 ? data.map(workout =>
                    <Card key={workout.id} uri='workouts' id={workout.id} title={workout.name} footer={workout.source_url} body={workout.description} />
                ) : <h2>No workouts could be loaded!</h2>}

            </div>

        </>
    )
}

export default Workouts