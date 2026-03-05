import type { WorkoutSession } from "../workout.types"
import type { columnConfig } from "../../../shared/components/Table/table.types"
import EventMessage from "../../../shared/components/EventMessage"
import Table from "../../../shared/components/Table"

type WorkoutSessionListProps = {
    sessions:WorkoutSession[];
    isError:boolean;
    isPending:boolean;
    error:Error;
    sessionPreviewFlagHandler?:React.Dispatch<React.SetStateAction<number|null>>;
}

const session_columns: columnConfig<WorkoutSession>[]=[
        {key: 'id', header:'Id'},
        {key: 'exercise_instances', header:'Exercises'},
        {key: 'start_time', header:'Start date'},
        {key: 'end_time', header:'End date'},
    ]

//SessionPreviewFlagHandler to be added to function props
function WorkoutSessionList({sessions, isPending, isError, error}:WorkoutSessionListProps){

    if(isPending){
        return <EventMessage style="loading"/>
    }

    if(isError){
        return <EventMessage message={error.message} style="error"/>
    }

    if(!sessions.length){
        return <EventMessage message="There are no sessions for this workout" style="warning"/>
    }

    return(
        <Table<WorkoutSession> data={sessions} columns={session_columns}></Table>
    )
}

export default WorkoutSessionList