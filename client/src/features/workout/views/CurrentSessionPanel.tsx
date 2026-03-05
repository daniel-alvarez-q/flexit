import type { ExerciseLog, WorkoutSession } from "../workout.types";
import type { Exercise } from "../../exercises/exercises.types";
import type { columnConfig } from "../../../shared/components/Table/table.types";
import { getCategoryLabel } from "../../../shared/utils/constants/category";
import Popup from "../../../shared/components/Popup";
import Table from "../../../shared/components/Table";
import EventMessage from "../../../shared/components/EventMessage";

type currentSessionPanelProps = {
    session:WorkoutSession
    exercises:Exercise[]
}

const exercise_log_columns: columnConfig<Partial<ExerciseLog>>[] = [
        {key: 'exercise_name', header:'Exercise'},
        {key: 'exercise_category', header:'Category'},
        {key: 'log_time', header:'Log time'}
    ]

function CurrentSessionPanel({session, exercises}:currentSessionPanelProps){
    let logs:ExerciseLog[]|null = null
    if(session){
        logs = session.exercise_logs.map((log:ExerciseLog)=>{
            const exercise = exercises.find(e=>e.id==log.exercise)
            const date = new Date(log.log_time).toLocaleString()
            return({...log,exercise_name:exercise?.name, exercise_category:getCategoryLabel(exercise?.category), log_time:date})
        })
        console.log(logs)
    }
    if(!logs){
        return <EventMessage style="warning" message="No exercises have been logged"></EventMessage> 
    }
    
    return(
        <Table<Partial<ExerciseLog>> data={logs} columns={exercise_log_columns}></Table>
    )
}

export default CurrentSessionPanel