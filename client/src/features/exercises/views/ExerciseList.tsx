import { useAuth } from "../../../context/AuthContext"
import Card from "../../../shared/components/Card"
import EventMessage from "../../../shared/components/EventMessage"
import { useQuery } from "@tanstack/react-query"
import type { Exercise } from "../exercises.types"

function ExerciseList(){
    
    const {axios_instance} = useAuth()!

    const {isPending, isError, error ,data:exercises} = useQuery({
        queryKey: ['exercises'],
        queryFn: async ():Promise<Array<Exercise>> => {
            const response = await axios_instance.get('api/exercises')
            return response.data
        }
    })

    if(isPending){
        return (
            <div className="col-12 col-sm-3 custom-justify-content-center">
                <Card style="loading" />
            </div>
        )
    }

    if(isError){
        console.log(`Error!! ${error.message}`)
        return(
            <div className="col-12 custom-justify-content-center">
                <EventMessage message={error.message} />
            </div>
        )
    }

    return(
        <>
            { exercises.length ? exercises.map(exercise =>
                <div className="col-12 col-lg-3 custom-justify-content-center" key={exercise.id}>
                    <Card 
                    id={exercise.id} 
                    title={exercise.name} 
                    body={exercise.description} 
                    footer={`Last updated: ${exercise.updated_at}`} 
                    style="exercise" />
                </div>
            )
            :<div className="col-12">
                <EventMessage style="warning" message="No exercises have been created." />
            </div>
            }
        </>
    )
}

export default ExerciseList