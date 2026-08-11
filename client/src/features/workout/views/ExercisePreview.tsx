import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../context/AuthContext";
import type { Exercise } from "../../exercises/exercises.types";
import type { ExerciseLog } from "../workout.types";
import type { columnConfig } from "../../../shared/components/Table/table.types";
import { NavLink } from "react-router-dom";
import Popup from "../../../shared/components/Popup";
import Table from "../../../shared/components/Table";
import EventMessage from "../../../shared/components/EventMessage";
import { getFocusLabel } from "../../../shared/utils/constants/exercise_focus";
import './styles/exercisePreview.css'


type ExercisePreviewParams = {
    id:number;
    errorHandler:React.Dispatch<React.SetStateAction<string | null>>;
    displayFlagHandler:React.Dispatch<React.SetStateAction<number|null>>;
}

type QueryResponse = {
    exercise:Exercise,
    logs:Array<ExerciseLog>
}

function ExercisePreview({id, errorHandler, displayFlagHandler}:ExercisePreviewParams){
    const {axios_instance} = useAuth()!
    // const queryClient = useQueryClient()

    const str_log_columns:columnConfig<ExerciseLog>[] = [
        {key:'log_time', header:'Date'},
        {key:'series', header:'Series'},
        {key:'repetitions', header:'Reps'},
        {key:'weight', header:'Weight'}
    ]

    const car_log_columns:columnConfig<ExerciseLog>[] = [
        {key:'log_time', header:'Date'},
        {key:'distance', header:'Distance (km)'},
        {key:'duration', header:'Duration (mins)'},
    ]

    const {isPending, isError, error, data} = useQuery({
        queryKey:['exercise', id],
        queryFn: async ():Promise<QueryResponse> =>{
            const [exerciseResponse, logResponse] = await Promise.all(
                [( axios_instance.get(`api/exercise/${id}`).then(r=>{
                    let e:Exercise = r.data
                    return {...e, focus_area_full: getFocusLabel(e.focus_area || '')}
                })),
                axios_instance.get(`api/exercise/${id}/logs`).then(r=>{
                    if(r.data.length){ 
                        return r.data.reverse().slice(0,5).map((log:ExerciseLog) => { 
                            const date = new Date(log.log_time)
                            return {...log, log_time:date.toLocaleString()}
                        })
                    }else{
                        return []
                    }
                })]
            )
            return {
                exercise: exerciseResponse,
                logs: logResponse
            }
        },
        refetchOnMount: 'always',
    })

    if(isPending){
        return(
            <Popup title="Exercise preview" onClose={() => displayFlagHandler(null)}>
                Loading
            </Popup>
        )
    }

    if(isError){
        errorHandler(error.message)
        return(
            <Popup title="Exercise preview" onClose={() => displayFlagHandler(null)}>
                Error loading exercise: {error.message}
            </Popup>
        )
    }

    return(
        <Popup title="Exercise preview" onClose={()=> displayFlagHandler(null)}>
            <div className="preview-detail">
                <div className="preview-attribute">
                    <strong>Title: </strong><NavLink to={`/exercises/${data.exercise.id}`}>{data.exercise.name}</NavLink>
                </div>
                <div className="preview-attribute">
                    <strong>Description: </strong> {data.exercise.description}
                </div>
                {data.exercise.category === 'str' ?
                    <>
                        <div className="preview-attribute">
                            <strong>Focus area: </strong> {data.exercise.focus_area_full || 'N/A'} 
                        </div>
                        <div className="preview-attribute">
                            <strong>Recommended series: </strong> {data.exercise.series || 'N/A'}
                        </div>
                        <div className="preview-attribute">
                            <strong>Recommended repetitions: </strong> {data.exercise.repetitions || 'N/A'}
                        </div>                
                    </>
                    :data.exercise.category === 'car' &&
                    <>
                        <div className="preview-attribute">
                            <strong>Recommended distance (km): </strong> {data.exercise.distance || 'NA'}
                        </div>
                        <div className="preview-attribute">
                            <strong>Recommended duration (minutes): </strong> {data.exercise.duration || 'N/A'}
                        </div>                
                    </>

                }
                <div className="preview-attribute">
                    {data.logs.length ?
                    <Table data={data.logs} columns={data.exercise.category == 'str' ? str_log_columns : car_log_columns}/>
                    :<EventMessage style="warning" message="There are no logs for this exercise."/>}
                </div>
            </div>
        </Popup>
    )
}

export default ExercisePreview