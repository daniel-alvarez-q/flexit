import type { JSX } from 'react';
import './kpiCard.css'


type KpiCardParameters = {
    label:string;
    value:number;
    delta_reference:number;
}

function KpiCard({label, value, delta_reference}:KpiCardParameters){

    let subtext:JSX.Element|null = null
    if(delta_reference){
        let delta:number = value - delta_reference
        if(delta >= 0){
            subtext = <div className='increment'> &#9650; {delta.toFixed(2)}</div>
        }else if(delta===0){
            subtext = <div className='sustained'> &equals; {delta.toFixed(2)}</div>
        }else{
            subtext = <div className='decrease'>&#9660; {(delta*(-1)).toFixed(2)}</div>
        }
    }

    return(
        <article className="kpi-card">
            <div className="kpi-label">{label}</div>
            <div className="kpi-value">{value}</div>
            <div className="kpi-subtext">{subtext}</div>
        </article>
    )
}

export default KpiCard