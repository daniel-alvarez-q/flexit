import { NavLink } from "react-router-dom";
import type {CardType} from "./card.types";
import './card.css' 

function Card({id, title, subtitle, body, footer, style='default', uri=null}:CardType){
    return(
        <div className={"main-card " + style}>
            <div className="card-title">
                <span className="card-title-text">
                    {uri ? (<NavLink to={uri+'/'+id}>{title}</NavLink>): title}
                </span>
            </div>
            { subtitle ? (
                <div className="card-subtitle">
                    <span className="card-subtitle-text">{subtitle}</span>
                </div>
            ): null}
            <div className="card-body">
                <span className="card-body-content">{body}</span>
            </div>
            {footer ? (
                <div className="card-footer">
                    <span className="card-footer-text">{footer}</span>
                </div>
            ): null}
        </div>
    )
}
export default Card