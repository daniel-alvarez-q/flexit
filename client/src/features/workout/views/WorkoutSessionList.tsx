import type { WorkoutSession } from "../workout.types"
import type { columnConfig } from "../../../shared/components/Table/table.types"
import ContentSection from "../../../shared/components/ContentSection"
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
        {key: 'duration', header:'Duration (mins)'},
        {key: 'start_time', header:'Date'},
    ]

//SessionPreviewFlagHandler to be added to function props
function WorkoutSessionList({sessions, isPending, isError, error}:WorkoutSessionListProps){



    return(
        <ContentSection title="Past sessions">
            <div className="workout-table">
                {isPending ?
                <EventMessage style="loading"/>
                : isError ?
                <EventMessage message={error.message} style="error"/>
                : !sessions.length ?
                <EventMessage message="There are no sessions for this workout" style="warning"/>
                : sessions &&
                <Table<WorkoutSession> data={sessions} columns={session_columns}></Table>
                }
            </div>
        </ContentSection>
        
    )
}

export default WorkoutSessionList