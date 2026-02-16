import ExerciseList from "./views/ExerciseList"

function Exercises(){

    return(
        <>
            <div className="row">
                <div className="template-title">Exercises</div>
            </div>
            <div className="row justify-content-center g-4">
                <ExerciseList />
            </div>
        </>
    )
}

export default Exercises