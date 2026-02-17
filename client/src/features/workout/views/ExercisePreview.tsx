import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import type { Exercise } from "../../exercises/exercises.types";
import type { ExerciseLog } from "../workout.types";
import type { columnConfig } from "../../../shared/components/Table/table.types";
import Popup from "../../../shared/components/Popup";
import Table from "../../../shared/components/Table";
import './exercisePreview.css'
import EventMessage from "../../../shared/components/EventMessage";

type ExercisePreviewParams = {
    id:number;
    errorHandler:React.Dispatch<React.SetStateAction<string | null>>;
    displayFlagHandler:React.Dispatch<React.SetStateAction<boolean>>;
}

type QueryResponse = {
    exercise:Exercise,
    logs:Array<ExerciseLog>
}

function ExercisePreview({id, errorHandler, displayFlagHandler}:ExercisePreviewParams){
    const {axios_instance} = useAuth()!
    // const queryClient = useQueryClient()

    const log_columns:columnConfig<ExerciseLog>[] = [
        {key:'log_time', header:'Log time'},
        {key:'series', header:'Series'},
        {key:'repetitions', header:'Repetitions'},
        {key:'weight', header:'Weight'}
    ]

    const {isPending, isError, error, data} = useQuery({
        queryKey:['exercise', id],
        queryFn: async ():Promise<QueryResponse> =>{
            const [exerciseResponse, logResponse] = await Promise.all(
                [( axios_instance.get(`api/exercise/${id}`).then(r=>r)),
                axios_instance.get(`api/exercise/${id}/logs`).then(r=>{
                    if(r.data.length){ 
                        return r.data.map((log:ExerciseLog) => { 
                            const date = new Date(log.log_time)
                            return {...log, log_time:date.toLocaleString()}
                        })
                    }else{
                        return []
                    }
                })]
            )
            console.log(logResponse)
            return {
                exercise: exerciseResponse.data,
                logs: logResponse
            }
        },
        refetchOnMount: 'always',
    })

    if(isPending){
        return(
            <Popup title="Exercise preview" onClose={() => displayFlagHandler(false)}>
                Loading
            </Popup>
        )
    }

    if(isError){
        errorHandler(error.message)
        return(
            <Popup title="Exercise preview" onClose={() => displayFlagHandler(false)}>
                Error loading exercise: {error.message}
            </Popup>
        )
    }

    return(
        <Popup title="Exercise preview" onClose={()=> displayFlagHandler(false)}>
            <div className="preview-detail">
                <div className="preview-attribute">
                    <strong>Title: </strong>{data.exercise.name}
                </div>
                <div className="preview-attribute">
                    <strong>Description: </strong> {data.exercise.description}
                </div>
                <div className="preview-attribute">
                    {data.logs.length ?
                    <Table data={data.logs} columns={log_columns}/>
                    :<EventMessage style="warning" message="There are no logs for this exercise."/>}
                </div>
            </div>
        </Popup>
    )
}

export default ExercisePreview