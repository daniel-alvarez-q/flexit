import ContentSection from "../ContentSection"
import { useNavigate } from "react-router-dom"

function NotFound(){

    const navigate = useNavigate()

    const return_action = () =>{
        navigate('/')
    }

    return(
        <>
            <div className="row">
                <div className="template-title">Not Found</div>
            </div>
            <div className="row justify-content-center">
                <div className="col-12 col-sm-8">
                    <ContentSection>
                        <p>The view you are looking for does not seem to exist.</p>
                        <button className="btn-md" onClick={()=>return_action()}>
                            Return somewhere safe (Home)
                        </button>
                    </ContentSection>
                </div>
            </div>
        </>
    )
}

export default NotFound