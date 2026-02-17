import { NavLink } from 'react-router-dom';
import './horizontalCard.css'

type HorizontalCardType = {
    id?:number;
    title:string;
    subtitle?:string|null;
    body:string;
    uri?:string|null;
    onClick?: ()=>void
}

function HorizontalCard({id, title, subtitle=null, body, uri=null, onClick}: HorizontalCardType){
    return(
        <div className="horizontal-card">
            <div className="header">
                <div className="title">
                    {/* {uri && id ? <NavLink to={`${uri}/${id}`}>{title}</NavLink> : title} */}
                    {onClick && id ? <a onClick={onClick}>{title}</a> : title}
                </div>
                {subtitle && <div className='subtitle'>{subtitle}</div>}
            </div>
            <div className="body">
                <div className="content">{body}</div>
            </div>
        </div>
    )
}

export default HorizontalCard