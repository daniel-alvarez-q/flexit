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
                            <div className="card-title-text">
                                {uri ? (<NavLink to={`/${uri}/${id}`}>{title}</NavLink>): title}
                            </div>
                        </div>
                        {subtitle && (
                            <div className="card-subtitle">
                                <div className="card-subtitle-text">{subtitle}</div>
                            </div>
                        )}
                    </div>
                    <div className="card-body">
                        <div className="card-body-content">{body}</div>
                    </div>
                    {footer && (
                        <div className="card-footer">
                            <div className="card-footer-text">{footer}</div>
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