import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import type { Workout } from "../workouts.types";
import Card from "../../../shared/components/Card";
import EventMessage from "../../../shared/components/EventMessage";

function WorkoutList(){

    const {axios_instance} = useAuth()!

    const {isPending, isError, error, data:workouts} = useQuery({
        queryKey:['workouts'],
        queryFn: async():Promise<Array<Workout>>=>{
            const response = await axios_instance.get('api/workouts')
            return response.data
        }
    })

    if(isPending){
        return (
            <div className="col-12 col-sm-3 custom-justify-content-center">
                <Card style="loading"/>
            </div>
        )
    }

    if(isError){
        return(
            <div className="col-12">
                <EventMessage style='error' message={error.message}/>
            </div>
        )
    }

    return(
        <>
        {workouts.length ?
            workouts.map(workout =>
                <div key={workout.id} className="col-12 col-lg-3 custom-justify-content-center">
                    <Card uri='workouts' id={workout.id} title={workout.name} footer={workout.created_at} body={workout.description} />
                </div>
            )
        :<div className="col-12">
            <EventMessage style='warning' message='No workouts have been created.'/>
        </div>
        }
        </>
    )
}

export default WorkoutList