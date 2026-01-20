import { useState, useEffect} from "react"
import type { Workout } from "./workouts.types"
import axios_instance from "../../request_interceptor"
import Card from "../../shared/components/Card"
import EventMessage from "../../shared/components/EventMessage"

function Workouts(){
    const [data, setData] = useState<Workout[]>([])
    
    useEffect(() => {
        axios_instance.get('api/workouts')
        .then(response => {
            setData(response.data);
        })
        .catch(error => {
            console.error('Error feching data: ', error);
        });
        }, []);

    return(
        <>
            <div className="template-title">Workouts</div>
            <div className="row">
                {data.length > 1 ? data.map(workout =>
                    <Card key={workout.id} uri='workouts' id={workout.id} title={workout.name} footer={workout.source_url} body={workout.description} />
                ) : <EventMessage style="loading"></EventMessage>}

            </div>

        </>
    )
}

export default Workouts