import { useState, useEffect } from "react"
import { Line } from "react-chartjs-2";
import EventMessage from "../../../shared/components/EventMessage";
import type { ExerciseTimeseries } from "../../exercises/exercises.types";
import type { ChartData, Point } from "chart.js";

type ExerciseChartParams = {
    timeseries:ExerciseTimeseries|null;
    category:string;
}

function ExerciseChartComponent({timeseries, category}:ExerciseChartParams){
    const [chartData, setChartData] = useState<ChartData<"line", (number | Point | null)[], unknown>|null>(null)

    // Chart configuration
    const options = {
        responsive: true,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        stacked: false,
        // plugins: {
        //     title: {
        //     display: true,
        //     text: 'Chart.js Line Chart - Multi Axis',
        //     },
        // },
        scales: {
            y: {
                type: 'linear' as const,
                display: true,
                position: 'left' as const,
            },
            y1: {
                type: 'linear' as const,
                display: true,
                position: 'right' as const,
                grid: {
                    drawOnChartArea: false,
                },
            },
            x:{
                display:false,
                ticks: {
                    minRotation: 0,
                    maxRotation: 0
                }
            }
        },
    };

    useEffect(()=>{
        if(timeseries){
                const labels:string[] = (Object.keys(timeseries))
                if(category == 'str'){
                    setChartData({
                    labels,
                    datasets: [
                        {
                            label: '1RM',
                            data: labels.map((label:string)=> {
                                return timeseries[label]['1RM']
                            }),
                            borderColor: 'rgb(250 75 42)',
                            
                            yAxisID: 'y'
                        },
                        {
                            label: 'Volume',
                            data: labels.map((label:string)=> {
                                return timeseries[label]['volume']
                            }),
                            borderColor: 'rgb(215 243 31)',
                            yAxisID: 'y1'
                        },
                    ],
                    })
                } else if (category == 'car'){
                    setChartData({
                    labels,
                    datasets: [
                        {
                            label: 'Distance',
                            data: labels.map((label:string)=> {
                                return timeseries[label]['distance']
                            }),
                            borderColor: 'rgb(250 75 42)',
                            
                            yAxisID: 'y'
                        },
                        {
                            label: 'Duration (mins)',
                            data: labels.map((label:string)=> {
                                return timeseries[label]['duration']
                            }),
                            borderColor: 'rgb(215 243 31)',
                            yAxisID: 'y1'
                        },
                    ],
                    })
                }
                
            }
    }, [timeseries])

    return(
        <>
        {chartData ?
        <Line data={chartData} options={options}></Line>
        :<EventMessage style="warning" message="At least two exercise logs are required to track these metrics."/>}
        </>
    )

}

export default ExerciseChartComponent