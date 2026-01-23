import { NavLink } from "react-router-dom";
import type {CardType} from "./card.types";
import './card.css' 

function Card({id, title, subtitle, body, footer, style='default', uri=null, onClick}:CardType){
    return(
        <div className={"main-card " + style}>
            {style!=='action' ?
                <>
                    <div className="card-header">
                        <div className="card-title">
                            <span className="card-title-text">
                                {uri ? (<NavLink to={`/${uri}/${id}`}>{title}</NavLink>): title}
                            </span>
                        </div>
                        {subtitle && (
                            <div className="card-subtitle">
                                <span className="card-subtitle-text">{subtitle}</span>
                            </div>
                        )}
                    </div>
                    <div className="card-body">
                        <span className="card-body-content">{body}</span>
                    </div>
                    {footer && (
                        <div className="card-footer">
                            <span className="card-footer-text">{footer}</span>
                        </div>
                    )}
                </>:
                <>
                <div className="card-body" onClick={onClick}>
                    {uri? <NavLink to={uri}>{body}</NavLink> : body}
                </div>
                </>
            }

        </div>
    )
}
export default Card